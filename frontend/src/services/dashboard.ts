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
  try {
    return await Promise.race([
      api.get<DashboardData>("/dashboard/summary", true),
      new Promise<DashboardData>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout ao carregar dashboard")), 8000)
      ),
    ]);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    // Retornar dados padrão em caso de timeout ou erro
    return {
      balance: 0,
      labels: [],
      receita: [],
      despesa: [],
      totalReceitasRecebidas: 0,
      totalDespesasPagas: 0,
      receitasPendentes: 0,
      despesasPendentes: 0,
      proximos7Dias: [],
      alertas: [],
      categorias: [],
      notificacoes: [],
      dica: "Mantenha o controle de suas despesas.",
      incomeVsExpenseDetail: {
        defaultPeriod: "6m",
        periods: [],
      },
    };
  }
}

export async function getIncomeVsExpenseDetail(): Promise<IncomeVsExpenseDetail> {
  return api.get<IncomeVsExpenseDetail>("/dashboard/income-vs-expense", true);
}
