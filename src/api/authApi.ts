import api from "./axiosInstance";

export type LoginResponse = { token: string; email: string; role: string };
export type RegisterResponse = { message: string; role: string };

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
  return data;
}

export async function register(email: string, password: string, role: "USER" | "ADMIN" = "USER"): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", { email, password, role });
  return data;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}
