import { Despesa } from '../entities/despesa';

export interface IDespesaRepository {
  create(data: Omit<Despesa, 'id'>): Promise<Despesa>;
  findAll(): Promise<Despesa[]>;
  findById(id: number): Promise<Despesa | null>;
  update(
    id: number,
    data: Partial<Omit<Despesa, 'id'>>,
  ): Promise<Despesa | null>;
  remove(id: number): Promise<boolean>;
}
