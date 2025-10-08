import { api } from "./api";

export type Categoria = { id: number; nomeCategoria: string };

export async function listCategorias() {
  return api.get<Categoria[]>("/categoria");
}

export async function getCategoria(id: number) {
  return api.get<Categoria>(`/categoria/${id}`);
}

