import { api } from "./api";

export type Usuario = { id: number; nome: string };

export async function listUsuarios() {
  return api.get<Usuario[]>("/usuario");
}

export async function getUsuario(id: number) {
  return api.get<Usuario>(`/usuario/${id}`);
}

export type UpdateUsuarioInput = Partial<{ nome: string }>;

export async function updateUsuario(id: number, input: UpdateUsuarioInput) {
  return api.patch<Usuario>(`/usuario/${id}`, input);
}

export async function deleteUsuario(id: number) {
  return api.delete<any>(`/usuario/${id}`);
}

