import { Categoria } from './categoria.entity';

describe('Categoria Entity', () => {
  it('Deve criar entidade com valores default corretamente', () => {
    const categoria = new Categoria();
    categoria.nomeCategoria = 'Educação';
    expect(categoria.nomeCategoria).toBe('Educação');
  });

  it('Deve mapear os campos do banco corretamente', () => {
    const categoria = new Categoria();
    expect(categoria).toHaveProperty('id');
    expect(categoria).toHaveProperty('nomeCategoria');
  });
});
