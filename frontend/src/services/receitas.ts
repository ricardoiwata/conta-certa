import { api } from "./api";

export type CreateReceitaInput = {
  descricao: string;
  valor: number;
  data: string; // yyyy-mm-dd or dd/mm/yyyy
  dataCompetencia: string; // yyyy-mm-dd or dd/mm/yyyy
  origem: "Fixo" | "Variável" | string;
  recorrentePai: boolean;
  recorrentePaiId?: number; // default 0
  realizada: boolean;
  usuarioUid: string;
};

export async function createReceita(input: CreateReceitaInput) {
  const body = {
    ...input,
    recorrentePaiId: input.recorrentePaiId ?? 0,
  };
  return api.post<any>("/receita", body);
}

export async function listReceitas() {
  return api.get<any[]>("/receita", true);
}

export async function getReceita(id: number) {
  return api.get<any>(`/receita/${id}`, true);
}

export async function listReceitasRecorrentes() {
  return api.get<any[]>("/receita/recorrentes", true);
}

export async function listReceitasRecorrentesFilhas(recorrentePaiId: number) {
  return api.get<any[]>(`/receita/recorrentes/${recorrentePaiId}`, true);
}

export type UpdateReceitaInput = Partial<{
  descricao: string;
  valor: number;
  data: string;
  dataCompetencia: string;
  origem: string;
  recorrentePai: boolean;
  recorrentePaiId: number;
  realizada: boolean;
}>;

export async function updateReceita(id: number, input: UpdateReceitaInput) {
  return api.patch<any>(`/receita/${id}`, input);
}

export async function marcarReceitaRealizada(id: number, realizada = true) {
  return api.patch<any>(`/receita/${id}`, { realizada });
}

export async function deleteReceita(id: number) {
  return api.delete<any>(`/receita/${id}`);
}

