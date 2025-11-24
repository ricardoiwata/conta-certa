import { api } from "./api";

export type CreateDespesaInput = {
  descricao: string;
  valor: number;
  data: string; 
  formaPagamento: "Débito" | "Cheque" | "Crédito" | "Pix" | "Dinheiro" | "Boleto" | string;
  recorrentePai: boolean;
  recorrentePaiId?: number; 
  realizada: boolean;
  usuarioUid: string;
  categoriaId: number;
};

export async function createDespesa(input: CreateDespesaInput) {
  const body = {
    ...input,
    recorrentePaiId: input.recorrentePaiId ?? 0,
  };
  return api.post<any>("/despesa", body, true);
}

export async function listDespesas() {
  return api.get<any[]>("/despesa", true);
}

export async function getDespesa(id: number) {
  return api.get<any>(`/despesa/${id}`, true);
}

export async function listDespesasRecorrentes() {
  return api.get<any[]>("/despesa/recorrentes", true);
}

export async function listDespesasRecorrentesFilhas(recorrentePaiId: number) {
  return api.get<any[]>(`/despesa/recorrentes/${recorrentePaiId}`, true);
}

export type UpdateDespesaInput = Partial<{
  descricao: string;
  valor: number;
  data: string;
  formaPagamento: string;
  recorrentePai: boolean;
  recorrentePaiId: number;
  realizada: boolean;
  categoriaId: number;
}>;

export async function updateDespesa(id: number, input: UpdateDespesaInput) {
  return api.patch<any>(`/despesa/${id}`, input, true);
}

export async function marcarDespesaRealizada(id: number, realizada = true) {
  return api.patch<any>(`/despesa/${id}`, { realizada }, true);
}

export async function deleteDespesa(id: number) {
  return api.delete<any>(`/despesa/${id}`, true);
}
