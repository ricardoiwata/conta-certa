export class CreateDespesaDto {
  descricao!: string;
  valor!: number;
  data!: Date | string;
  usuarioId?: number;
}
