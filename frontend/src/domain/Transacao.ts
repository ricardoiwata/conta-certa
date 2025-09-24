export type TransacaoProps = {
  id?: number;
  idUsuario: number;
  idConta: number;
  idCategoria: number;
  descricao: string;
  valor: number;
  data: Date;
  dataCompetencia: Date;
  ehRecorrente: boolean;
  observacao?: string;
  realizada: boolean;
  idTransacaoRecorrentePai?: number;
};

function normalizeValor(v: number): number {
  if (!Number.isFinite(v)) throw new Error("Valor inválido");
  return Math.round(v * 100) / 100;
}

export abstract class Transacao {
  private _id?: number;
  private _idUsuario: number;
  private _idConta: number;
  private _idCategoria: number;
  private _descricao: string;
  private _valor: number;
  private _data: Date;
  private _dataCompetencia: Date;
  private _ehRecorrente: boolean;
  private _idTransacaoRecorrentePai?: number;
  private _observacao?: string;
  private _realizada: boolean;

  constructor(
    idUsuario: number,
    idConta: number,
    idCategoria: number,
    descricao: string,
    valor: number,
    data: Date,
    dataCompetencia: Date,
    ehRecorrente: boolean,
    observacao: string | undefined,
    realizada: boolean
  ) {
    if (!descricao || !descricao.trim()) {
      throw new Error("Descrição não pode ser vazia");
    }
    if (!(valor > 0)) {
      throw new Error("Valor deve ser maior que zero");
    }
    if (!data) {
      throw new Error("Data não pode ser nula");
    }
    if (!dataCompetencia) {
      throw new Error("Data de competência não pode ser nula");
    }

    this._idUsuario = idUsuario;
    this._idConta = idConta;
    this._idCategoria = idCategoria;
    this._descricao = descricao.trim();
    this._valor = normalizeValor(valor);
    this._data = data;
    this._dataCompetencia = dataCompetencia;
    this._ehRecorrente = !!ehRecorrente;
    this._observacao = observacao;
    this._realizada = !!realizada;
  }

  public getId(): number | undefined {
    return this._id;
  }

  public getDescricao(): string {
    return this._descricao;
  }

  public setDescricao(descricao: string): void {
    if (!descricao || !descricao.trim()) {
      throw new Error("Descrição não pode ser vazia");
    }
    this._descricao = descricao.trim();
  }

  public getValor(): number {
    return this._valor;
  }

  public setValor(valor: number): void {
    if (!(valor > 0)) {
      throw new Error("Valor deve ser maior que zero");
    }
    this._valor = normalizeValor(valor);
  }

  public getData(): Date {
    return this._data;
  }

  public setData(data: Date): void {
    if (!data) throw new Error("Data não pode ser nula");
    this._data = data;
  }

  public marcarComoRealizada(): void {
    this._realizada = true;
  }

  public isRealizada(): boolean {
    return this._realizada;
  }

  public get idUsuario(): number {
    return this._idUsuario;
  }
  public get idConta(): number {
    return this._idConta;
  }
  public get idCategoria(): number {
    return this._idCategoria;
  }
  public get dataCompetencia(): Date {
    return this._dataCompetencia;
  }
  public get ehRecorrente(): boolean {
    return this._ehRecorrente;
  }
  public get observacao(): string | undefined {
    return this._observacao;
  }
  public get idTransacaoRecorrentePai(): number | undefined {
    return this._idTransacaoRecorrentePai;
  }
  public set idTransacaoRecorrentePai(v: number | undefined) {
    this._idTransacaoRecorrentePai = v;
  }
}

export class Receita extends Transacao {}

export class Despesa extends Transacao {}

export function parseValorFromInput(input: string): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const v = Number(normalized);
  if (!Number.isFinite(v)) return NaN;
  return v;
}

export function parseDateFromInput(input: string): Date | null {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
