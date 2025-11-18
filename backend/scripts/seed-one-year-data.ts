import 'tsconfig-paths/register';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Despesa } from '../src/modules/despesa/domain/entities/despesa.entity';
import { Receita } from '../src/modules/receita/domain/entities/receita.entity';
import { Categoria } from '../src/modules/categoria/domain/entities/categoria.entity';

const DEFAULT_USER_UID = 'seed-user-001';
const SUPPORTED_FORMA_PAGAMENTO: Despesa['formaPagamento'][] = [
  'Débito',
  'Crédito',
  'Pix',
  'Dinheiro',
];

interface SeedOptions {
  firebaseUid: string;
  months: number;
  wipeExisting: boolean;
}

function parseArgs(): SeedOptions {
  const [, , uidArg, monthsArg, ...rest] = process.argv;
  const firebaseUid = uidArg && !uidArg.startsWith('--') ? uidArg : process.env.SEED_USER_UID || DEFAULT_USER_UID;
  const numericArg = uidArg && uidArg.startsWith('--') ? monthsArg : rest[0];
  const monthsValue = monthsArg && !monthsArg.startsWith('--') ? monthsArg : numericArg;
  const months = Math.max(1, Number(monthsValue ?? 12));
  const wipeExisting = process.argv.includes('--wipe');

  return { firebaseUid, months, wipeExisting };
}

function getRandomFactor(variation = 0.1): number {
  const delta = (Math.random() * 2 - 1) * variation;
  return Number((1 + delta).toFixed(4));
}

function pickFormaPagamento(index: number): Despesa['formaPagamento'] {
  return SUPPORTED_FORMA_PAGAMENTO[index % SUPPORTED_FORMA_PAGAMENTO.length];
}

function ensureDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month, Math.min(day, 28));
  return date;
}

async function loadCategoriaMap(repo: Repository<Categoria>): Promise<Map<string, Categoria>> {
  const categorias = await repo.find();
  const map = new Map<string, Categoria>();
  for (const categoria of categorias) {
    map.set(categoria.nomeCategoria.toLowerCase(), categoria);
  }
  return map;
}

function resolveCategoriaId(map: Map<string, Categoria>, nome: string): number {
  const found = map.get(nome.toLowerCase());
  if (!found) {
    throw new Error(`Categoria "${nome}" não encontrada. Crie a categoria antes de rodar o seed.`);
  }
  return found.id;
}

async function seedData(app: INestApplicationContext, options: SeedOptions) {
  const despesaRepository = app.get<Repository<Despesa>>(getRepositoryToken(Despesa));
  const receitaRepository = app.get<Repository<Receita>>(getRepositoryToken(Receita));
  const categoriaRepository = app.get<Repository<Categoria>>(getRepositoryToken(Categoria));

  const categoriaMap = await loadCategoriaMap(categoriaRepository);

  if (options.wipeExisting) {
    await despesaRepository.delete({ usuarioUid: options.firebaseUid });
    await receitaRepository.delete({ usuarioUid: options.firebaseUid });
  }

  const receitasParaSalvar: Partial<Receita>[] = [];
  const despesasParaSalvar: Partial<Despesa>[] = [];

  const hoje = new Date();
  const baseYear = hoje.getFullYear();
  const baseMonth = hoje.getMonth();
  const diaHoje = hoje.getDate();

  for (let offset = 0; offset < options.months; offset++) {
    const targetDate = new Date(baseYear, baseMonth - offset, 1, 12, 0, 0, 0);
    const ano = targetDate.getFullYear();
    const mes = targetDate.getMonth();
    const isMesAtual = offset === 0;

    // Receitas fixas
    const salarioValorBase = 4800;
    const salarioData = ensureDate(ano, mes, 5);
    const salarioRealizada = !isMesAtual || diaHoje >= 5;

    receitasParaSalvar.push({
      descricao: `Salário ${salarioData.toLocaleDateString('pt-BR', { month: 'long' })}`,
      valor: Number((salarioValorBase * getRandomFactor(0.05)).toFixed(2)),
      data: salarioData,
      dataCompetencia: new Date(ano, mes, 1),
      origem: 'Fixo',
      recorrentePai: false,
      realizada: salarioRealizada,
      usuarioUid: options.firebaseUid,
    });

    // Receitas variáveis ocasionais
    if (Math.random() < 0.65) {
      const diaFreela = Math.min(20, 8 + Math.floor(Math.random() * 15));
      const receitaData = ensureDate(ano, mes, diaFreela);
      const realizada = !isMesAtual || diaHoje >= diaFreela;

      receitasParaSalvar.push({
        descricao: 'Freelance / Extra',
        valor: Number((900 * getRandomFactor(0.4)).toFixed(2)),
        data: receitaData,
        dataCompetencia: receitaData,
        origem: 'Variável',
        recorrentePai: false,
        realizada,
        usuarioUid: options.firebaseUid,
      });
    }

    if (Math.random() < 0.25) {
      const dayBonus = ensureDate(ano, mes, 28);
      receitasParaSalvar.push({
        descricao: 'Participação nos lucros',
        valor: Number((1500 * getRandomFactor(0.3)).toFixed(2)),
        data: dayBonus,
        dataCompetencia: dayBonus,
        origem: 'Variável',
        recorrentePai: false,
        realizada: !isMesAtual || diaHoje >= dayBonus.getDate(),
        usuarioUid: options.firebaseUid,
      });
    }

    // Despesas fixas
    const despesasFixasConfig = [
      {
        descricao: 'Aluguel / Condomínio',
        categoria: 'Casa',
        valorBase: 1800,
        dia: 3,
      },
      {
        descricao: 'Plano de saúde',
        categoria: 'Saúde',
        valorBase: 420,
        dia: 12,
      },
      {
        descricao: 'Internet e streaming',
        categoria: 'Casa',
        valorBase: 210,
        dia: 10,
      },
      {
        descricao: 'Transporte e combustível',
        categoria: 'Transporte',
        valorBase: 380,
        dia: 18,
      },
    ];

    despesasFixasConfig.forEach((config, index) => {
      const dataDespesa = ensureDate(ano, mes, config.dia);
      const realizada = !isMesAtual || diaHoje >= config.dia;

      despesasParaSalvar.push({
        descricao: config.descricao,
        valor: Number((config.valorBase * getRandomFactor(0.08)).toFixed(2)),
        data: dataDespesa,
        formaPagamento: pickFormaPagamento(index),
        recorrentePai: false,
        realizada,
        usuarioUid: options.firebaseUid,
        categoriaId: resolveCategoriaId(categoriaMap, config.categoria),
      });
    });

    // Despesas variáveis mensais
    const despesasVariaveisConfig = [
      {
        descricao: 'Supermercado do mês',
        categoria: 'Alimentação',
        valorBase: 950,
        dia: 7,
      },
      {
        descricao: 'Restaurantes e delivery',
        categoria: 'Alimentação',
        valorBase: 320,
        dia: 15,
      },
      {
        descricao: 'Lazer e entretenimento',
        categoria: 'Lazer',
        valorBase: 260,
        dia: 22,
      },
      {
        descricao: 'Educação e cursos',
        categoria: 'Educação',
        valorBase: 180,
        dia: 26,
      },
    ];

    despesasVariaveisConfig.forEach((config, index) => {
      const dataDespesa = ensureDate(ano, mes, config.dia);
      const realizada = !isMesAtual || diaHoje >= config.dia;

      despesasParaSalvar.push({
        descricao: config.descricao,
        valor: Number((config.valorBase * getRandomFactor(0.25)).toFixed(2)),
        data: dataDespesa,
        formaPagamento: pickFormaPagamento(index + despesasFixasConfig.length),
        recorrentePai: false,
        realizada,
        usuarioUid: options.firebaseUid,
        categoriaId: resolveCategoriaId(categoriaMap, config.categoria),
      });
    });

    // Despesa eventual (ex.: manutenção carro) a cada trimestre
    if (offset % 3 === 0) {
      const diaManutencao = ensureDate(ano, mes, 11 + Math.floor(Math.random() * 8));
      const realizada = !isMesAtual || diaHoje >= diaManutencao.getDate();

      despesasParaSalvar.push({
        descricao: 'Manutenção do carro',
        valor: Number((650 * getRandomFactor(0.3)).toFixed(2)),
        data: diaManutencao,
        formaPagamento: 'Boleto',
        recorrentePai: false,
        realizada,
        usuarioUid: options.firebaseUid,
        categoriaId: resolveCategoriaId(categoriaMap, 'Transporte'),
      });
    }

    // Despesa sazonal de fim de ano
    if (mes === 10) {
      const diaViagem = ensureDate(ano, mes, 27);
      despesasParaSalvar.push({
        descricao: 'Viagem de férias',
        valor: Number((3200 * getRandomFactor(0.2)).toFixed(2)),
        data: diaViagem,
        formaPagamento: 'Crédito',
        recorrentePai: false,
        realizada: !isMesAtual || diaHoje >= diaViagem.getDate(),
        usuarioUid: options.firebaseUid,
        categoriaId: resolveCategoriaId(categoriaMap, 'Lazer'),
      });
    }
  }

  if (receitasParaSalvar.length) {
    await receitaRepository.save(receitasParaSalvar as Receita[]);
  }

  if (despesasParaSalvar.length) {
    await despesaRepository.save(despesasParaSalvar as Despesa[]);
  }

  console.log(
    `Seed concluído com sucesso: ${receitasParaSalvar.length} receitas e ${despesasParaSalvar.length} despesas inseridas para o usuário ${options.firebaseUid}.`,
  );
}

(async () => {
  const options = parseArgs();

  let app: INestApplicationContext | null = null;
  try {
    app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
    await seedData(app, options);
  } catch (error) {
    console.error('Falha ao executar seed:', error);
    process.exitCode = 1;
  } finally {
    if (app) {
      await app.close();
    }
  }
})();
