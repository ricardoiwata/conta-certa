import { Usuario } from '../entities/usuario';

export interface IUsuarioRepository {
  create(data: Omit<Usuario, 'id'>): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  update(
    id: number,
    data: Partial<Omit<Usuario, 'id'>>,
  ): Promise<Usuario | null>;
  remove(id: number): Promise<boolean>;
}
