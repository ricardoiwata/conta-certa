export class Despesa {
  constructor(
    public id: number,
    public descricao: string,
    public valor: number,
    public data: Date,
    public usuarioId?: number,
  ) {}
}
