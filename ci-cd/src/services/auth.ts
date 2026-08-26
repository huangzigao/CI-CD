import { request } from "@/lib/http";
import type { LoginRequest, LoginResponse } from "@/types/api";

export const authApi = {
  login(data: LoginRequest) {
    return request<LoginResponse>({
      url: "/api/auth/login",
      method: "POST",
      data,
    });
  },
};
