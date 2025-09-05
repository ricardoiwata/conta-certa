import { IUsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { Usuario } from '../../../domain/entities/usuario';

export class InMemoryUsuarioRepository implements IUsuarioRepository {
  private items: Usuario[] = [];
  private seq = 1;

  create(data: Omit<Usuario, 'id'>): Promise<Usuario> {
    const created = new Usuario(this.seq++, data.nome, data.email);
    this.items.push(created);
    return Promise.resolve(created);
  }

  findAll(): Promise<Usuario[]> {
    return Promise.resolve([...this.items]);
  }

  findById(id: number): Promise<Usuario | null> {
    return Promise.resolve(this.items.find((u) => u.id === id) ?? null);
  }

  async update(
    id: number,
    data: Partial<Omit<Usuario, 'id'>>,
  ): Promise<Usuario | null> {
    const item = await this.findById(id);
    if (!item) return null;
    if (typeof data.nome === 'string') item.nome = data.nome;
    if (typeof data.email === 'string') item.email = data.email;
    return item;
  }

  remove(id: number): Promise<boolean> {
    const before = this.items.length;
    this.items = this.items.filter((u) => u.id !== id);
    return Promise.resolve(this.items.length < before);
  }
}
