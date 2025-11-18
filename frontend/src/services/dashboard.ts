import { api } from "./api";

export interface IncomeVsExpensePeriod {
  id: string;
  label: string;
  labels: string[];
  receita: number[];
  despesa: number[];
  insight: string;
  previousTotals: {
    receita: number;
    despesa: number;
  };
}

export interface IncomeVsExpenseDetail {
  defaultPeriod: string;
  periods: IncomeVsExpensePeriod[];
}

export interface DashboardData {
  balance: number;
  labels: string[];
  receita: number[];
  despesa: number[];
  totalReceitasRecebidas: number;
  totalDespesasPagas: number;
  receitasPendentes: number;
  despesasPendentes: number;
  proximos7Dias: Array<{
    id: string;
    tipo: string;
    titulo: string;
    data: string;
    valor: number;
  }>;
  alertas: Array<{
    id: string;
    tipo: string;
    texto: string;
  }>;
  categorias: Array<{
    nome: string;
    valor: number;
  }>;
  notificacoes: Array<{
    id: string;
    texto: string;
  }>;
  dica: string;
  incomeVsExpenseDetail?: IncomeVsExpenseDetail;
}

export async function getDashboardData(): Promise<DashboardData> {
  return api.get<DashboardData>("/dashboard/summary", true);
}

export async function getIncomeVsExpenseDetail(): Promise<IncomeVsExpenseDetail> {
  return api.get<IncomeVsExpenseDetail>("/dashboard/income-vs-expense", true);
}
