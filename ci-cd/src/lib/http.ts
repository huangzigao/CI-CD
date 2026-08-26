import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "@/lib/auth-storage";
import type { ApiResponse } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8888";

export class ApiError extends Error {
  readonly code: number;
  readonly status: number;

  constructor(message: string, code: number, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

function isApiResponse(value: unknown): value is ApiResponse {
  return (
    value !== null &&
    typeof value === "object" &&
    "code" in value &&
    "message" in value
  );
}

function toApiError(error: AxiosError<ApiResponse>) {
  const response = error.response;
  const body = response?.data;
  const status = response?.status ?? 0;
  const code = body?.code ?? status;
  const message = body?.message ?? error.message ?? "网络请求失败";

  return new ApiError(message, code, status);
}

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const body = response.data;

    if (isApiResponse(body) && body.code !== 0) {
      throw new ApiError(
        body.message || "请求失败",
        body.code,
        response.status,
      );
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => Promise.reject(toApiError(error)),
);

export async function request<T>(config: AxiosRequestConfig) {
  const response = await http.request<ApiResponse<T>>(config);

  return response.data.data as T;
}

export async function requestRaw<T>(config: AxiosRequestConfig) {
  const response = await http.request<T>(config);

  return response.data;
}

export default http;
