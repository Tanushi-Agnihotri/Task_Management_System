import api from "./axiosInstance";

export type UserDTO = { id: number; email: string; role: "USER" | "ADMIN" };

export async function getAllUsers(): Promise<UserDTO[]> {
  const { data } = await api.get<UserDTO[]>("/users");
  return data;
}
