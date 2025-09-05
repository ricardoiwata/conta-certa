import { IDespesaRepository } from '../../../domain/repositories/despesa.repository';
import { Despesa } from '../../../domain/entities/despesa';

export class InMemoryDespesaRepository implements IDespesaRepository {
  private items: Despesa[] = [];
  private seq = 1;

  create(data: Omit<Despesa, 'id'>): Promise<Despesa> {
    const created = new Despesa(
      this.seq++,
      data.descricao,
      data.valor,
      new Date(data.data),
      data.usuarioId,
    );
    this.items.push(created);
    return Promise.resolve(created);
  }

  findAll(): Promise<Despesa[]> {
    return Promise.resolve([...this.items]);
  }

  findById(id: number): Promise<Despesa | null> {
    return Promise.resolve(this.items.find((d) => d.id === id) ?? null);
  }

  async update(
    id: number,
    data: Partial<Omit<Despesa, 'id'>>,
  ): Promise<Despesa | null> {
    const item = await this.findById(id);
    if (!item) return null;
    if (typeof data.descricao === 'string') item.descricao = data.descricao;
    if (typeof data.valor === 'number') item.valor = data.valor;
    if (data.data) item.data = new Date(data.data);
    if (typeof data.usuarioId === 'number') item.usuarioId = data.usuarioId;
    return item;
  }

  remove(id: number): Promise<boolean> {
    const before = this.items.length;
    this.items = this.items.filter((d) => d.id !== id);
    return Promise.resolve(this.items.length < before);
  }
}
