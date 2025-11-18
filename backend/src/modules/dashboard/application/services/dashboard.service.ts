import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receita } from 'src/modules/receita/domain/entities/receita.entity';
import { Despesa } from 'src/modules/despesa/domain/entities/despesa.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Receita)
    private receitaRepository: Repository<Receita>,
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
  ) {}

  async getDashboardData(firebaseUid: string) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Obter receitas e despesas do usuário autenticado
    const { receitas, despesas } = await this.fetchUserEntries(firebaseUid);

    // Filtrar pelo mês atual
    const receitasDoMes = receitas.filter((r) => {
      try {
        const dateStr = typeof r.data === 'string' ? r.data : String(r.data);
        const date = this.parseDate(dateStr);
        return (
          date &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      } catch {
        return false;
      }
    });

    const despesasDoMes = despesas.filter((d) => {
      try {
        const dateStr = typeof d.data === 'string' ? d.data : String(d.data);
        const date = this.parseDate(dateStr);
        return (
          date &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      } catch {
        return false;
      }
    });

    // Calcular totalizadores
    const totalReceitasRecebidas = receitasDoMes
      .filter((r) => r.realizada)
      .reduce((acc, r) => acc + Number(r.valor || 0), 0);

    const totalDespesasPagas = despesasDoMes
      .filter((d) => d.realizada)
      .reduce((acc, d) => acc + Number(d.valor || 0), 0);

    const receitasPendentes = receitasDoMes
      .filter((r) => !r.realizada)
      .reduce((acc, r) => acc + Number(r.valor || 0), 0);

    const despesasPendentes = despesasDoMes
      .filter((d) => !d.realizada)
      .reduce((acc, d) => acc + Number(d.valor || 0), 0);

    const balance = totalReceitasRecebidas - totalDespesasPagas;

    // Próximos 7 dias
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    const proximos7Dias = [
      ...receitasDoMes
        .filter((r) => {
          const date = this.parseDate(typeof r.data === 'string' ? r.data : String(r.data));
          return date && date >= tomorrow && date <= in7Days && !r.realizada;
        })
        .map((r) => {
          const date = this.parseDate(typeof r.data === 'string' ? r.data : String(r.data));
          return {
            id: String(r.id),
            tipo: 'Receita',
            titulo: r.descricao,
            data: date?.toLocaleDateString('pt-BR') || 'Data inválida',
            valor: Number(r.valor || 0),
          };
        }),
      ...despesasDoMes
        .filter((d) => {
          const date = this.parseDate(typeof d.data === 'string' ? d.data : String(d.data));
          return date && date >= tomorrow && date <= in7Days && !d.realizada;
        })
        .map((d) => {
          const date = this.parseDate(typeof d.data === 'string' ? d.data : String(d.data));
          return {
            id: String(d.id),
            tipo: 'Despesa',
            titulo: d.descricao,
            data: date?.toLocaleDateString('pt-BR') || 'Data inválida',
            valor: Number(d.valor || 0),
          };
        }),
    ].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    // Últimos 6 meses (labels e dados para gráfico)
    const labels: string[] = [];
    const receitaData: number[] = [];
    const despesaData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const monthNum = date.getMonth();
      const yearNum = date.getFullYear();

      const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short' });
      labels.push(monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1));

      const monthReceitas = receitas
        .filter((r) => {
          const d = this.parseDate(typeof r.data === 'string' ? r.data : String(r.data));
          return d && d.getMonth() === monthNum && d.getFullYear() === yearNum;
        })
        .filter((r) => r.realizada)
        .reduce((acc, r) => acc + Number(r.valor || 0), 0);

      const monthDespesas = despesas
        .filter((d) => {
          const dt = this.parseDate(typeof d.data === 'string' ? d.data : String(d.data));
          return dt && dt.getMonth() === monthNum && dt.getFullYear() === yearNum;
        })
        .filter((d) => d.realizada)
        .reduce((acc, d) => acc + Number(d.valor || 0), 0);

      receitaData.push(monthReceitas);
      despesaData.push(monthDespesas);
    }

    // Alertas e notificações
    const alertas: any[] = [];
    if (totalDespesasPagas > totalReceitasRecebidas) {
      alertas.push({
        id: 'a1',
        tipo: 'warning',
        texto: `Suas despesas (R$ ${totalDespesasPagas.toFixed(2)}) ultrapassaram as receitas este mês`,
      });
    }

    // Próximas despesas vencendo
    const nextExpense = despesasDoMes
      .filter((d) => !d.realizada)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 1)[0];

    if (nextExpense) {
      alertas.push({
        id: 'a2',
        tipo: 'alert',
        texto: `${nextExpense.descricao} vence em breve`,
      });
    }

    // Categorias com maior gasto
    const categoriaGastos = despesasDoMes.reduce(
      (acc, d) => {
        const found = acc.find((c) => c.categoriaId === d.categoriaId);
        if (found) {
          found.valor += Number(d.valor || 0);
        } else {
          acc.push({
            categoriaId: d.categoriaId,
            nome: d.categoria?.nomeCategoria || 'Outros',
            valor: Number(d.valor || 0),
          });
        }
        return acc;
      },
      [] as any[],
    );

    const categorias = categoriaGastos
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
      .map((c) => ({ nome: c.nome, valor: c.valor }));

    const incomeVsExpenseDetail = this.buildIncomeVsExpenseDetail(
      receitas,
      despesas,
      now,
    );

    return {
      balance,
      labels,
      receita: receitaData,
      despesa: despesaData,
      totalReceitasRecebidas,
      totalDespesasPagas,
      receitasPendentes,
      despesasPendentes,
      proximos7Dias,
      alertas,
      categorias,
      notificacoes: [], // Implementar depois
      dica: 'Mantenha o controle de suas despesas para não ultrapassar o orçamento.',
      incomeVsExpenseDetail,
    };
  }

  async getIncomeVsExpenseDetail(firebaseUid: string) {
    const now = new Date();
    const { receitas, despesas } = await this.fetchUserEntries(firebaseUid);
    return this.buildIncomeVsExpenseDetail(receitas, despesas, now);
  }

  private async fetchUserEntries(firebaseUid: string) {
    const receitas = await this.receitaRepository.find({
      where: { usuarioUid: firebaseUid },
    });

    const despesas = await this.despesaRepository.find({
      where: { usuarioUid: firebaseUid },
      relations: ['categoria'],
    });

    return { receitas, despesas };
  }

  private buildIncomeVsExpenseDetail(
    receitas: Receita[],
    despesas: Despesa[],
    referenceDate: Date,
  ) {
    const periodConfigs = [
      { id: '3m', label: '3 meses', months: 3 },
      { id: '6m', label: '6 meses', months: 6 },
      { id: '12m', label: '12 meses', months: 12 },
    ];

    const { receitaMap, despesaMap } = this.aggregateMonthlyValues(receitas, despesas);

    const periods = periodConfigs.map((config) => {
      const currentRange = this.collectRangeTotals(
        receitaMap,
        despesaMap,
        referenceDate,
        config.months,
        0,
      );
      const previousRange = this.collectRangeTotals(
        receitaMap,
        despesaMap,
        referenceDate,
        config.months,
        config.months,
      );

      const receitaTotal = currentRange.receitaTotals.reduce((acc, value) => acc + value, 0);
      const despesaTotal = currentRange.despesaTotals.reduce((acc, value) => acc + value, 0);

      const highestExpenseIndex = currentRange.despesaTotals.reduce(
        (maxIndex, value, index, array) => (array[maxIndex] >= value ? maxIndex : index),
        0,
      );
      const highestExpenseLabel =
        currentRange.labels[highestExpenseIndex] || currentRange.labels[currentRange.labels.length - 1] || '';

      const insightParts: string[] = [];
      if (highestExpenseLabel) {
        insightParts.push(`Maior gasto em ${highestExpenseLabel}.`);
      }

      const saldoAtual = receitaTotal - despesaTotal;
      insightParts.push(
        saldoAtual >= 0
          ? 'Saldo permaneceu positivo no período.'
          : 'Saldo ficou negativo no período.',
      );

      insightParts.push(
        this.buildTrendSentence(
          'Receitas',
          currentRange.receitaTotals[0] ?? 0,
          currentRange.receitaTotals[currentRange.receitaTotals.length - 1] ?? 0,
        ),
      );

      insightParts.push(
        this.buildTrendSentence(
          'Despesas',
          currentRange.despesaTotals[0] ?? 0,
          currentRange.despesaTotals[currentRange.despesaTotals.length - 1] ?? 0,
        ),
      );

      const insight = insightParts
        .filter((part) => !!part)
        .join(' ')
        .trim();

      return {
        id: config.id,
        label: config.label,
        labels: currentRange.labels,
        receita: currentRange.receitaTotals,
        despesa: currentRange.despesaTotals,
        insight:
          insight || 'Acompanhe a evolução das suas receitas e despesas neste período.',
        previousTotals: {
          receita: previousRange.receitaTotals.reduce((acc, value) => acc + value, 0),
          despesa: previousRange.despesaTotals.reduce((acc, value) => acc + value, 0),
        },
      };
    });

    return {
      defaultPeriod: '6m',
      periods,
    };
  }

  private aggregateMonthlyValues(receitas: Receita[], despesas: Despesa[]) {
    const receitaMap = new Map<string, number>();
    const despesaMap = new Map<string, number>();

    for (const receita of receitas) {
      const date = this.parseDate(
        typeof receita.data === 'string' ? receita.data : String(receita.data),
      );
      if (!date || !receita.realizada) continue;
      const key = this.getMonthKey(date.getFullYear(), date.getMonth());
      const currentValue = receitaMap.get(key) ?? 0;
      receitaMap.set(key, currentValue + Number(receita.valor || 0));
    }

    for (const despesa of despesas) {
      const date = this.parseDate(
        typeof despesa.data === 'string' ? despesa.data : String(despesa.data),
      );
      if (!date || !despesa.realizada) continue;
      const key = this.getMonthKey(date.getFullYear(), date.getMonth());
      const currentValue = despesaMap.get(key) ?? 0;
      despesaMap.set(key, currentValue + Number(despesa.valor || 0));
    }

    return { receitaMap, despesaMap };
  }

  private collectRangeTotals(
    receitaMap: Map<string, number>,
    despesaMap: Map<string, number>,
    referenceDate: Date,
    months: number,
    startOffset: number,
  ) {
    const labels: string[] = [];
    const receitaTotals: number[] = [];
    const despesaTotals: number[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth() - (startOffset + i),
        1,
      );
      const key = this.getMonthKey(date.getFullYear(), date.getMonth());
      receitaTotals.push(receitaMap.get(key) ?? 0);
      despesaTotals.push(despesaMap.get(key) ?? 0);
      if (startOffset === 0) {
        labels.push(this.getMonthLabel(date));
      }
    }

    return { labels, receitaTotals, despesaTotals };
  }

  private getMonthKey(year: number, month: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  }

  private getMonthLabel(date: Date) {
    const label = date.toLocaleDateString('pt-BR', { month: 'short' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  private buildTrendSentence(label: string, firstValue: number, lastValue: number) {
    const difference = lastValue - firstValue;
    if (Math.abs(difference) < 0.5) {
      return `${label} mantiveram-se estáveis ao longo do período.`;
    }

    const direction = difference > 0 ? 'aumentaram' : 'diminuíram';
    const base = firstValue !== 0 ? Math.abs((difference / firstValue) * 100) : 0;
    const percentageText = base > 0 ? ` em ${base.toFixed(1)}%` : '';
    return `${label} ${direction}${percentageText} do início ao fim do período.`;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    try {
      // Tenta diferentes formatos de data
      // Formato ISO: 2025-11-18T14:30:00
      if (dateStr.includes('T')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d;
      }

      // Formato com hífen: 2025-11-18
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        if (!isNaN(d.getTime())) return d;
      }

      // Formato com barra: 18/11/2025
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        if (!isNaN(d.getTime())) return d;
      }

      // Tenta parse padrão
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;

      return null;
    } catch {
      return null;
    }
  }
}