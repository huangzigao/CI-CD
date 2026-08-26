export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  account: string;
  username: string;
  role: number;
}

export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface HealthResponse {
  code: number;
  message: string;
}
