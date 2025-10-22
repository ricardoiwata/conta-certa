import { validate } from 'class-validator';
import { CreateCategoriaDto } from './create-categoria.dto';

describe('CreateCategoriaDto', () => {
  it('Deve validar com sucesso um DTO válido', async () => {
    const dto = new CreateCategoriaDto();
    dto.nomeCategoria = 'Alimentação';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Deve falhar se faltar campo obrigatório', async () => {
    const dto = new CreateCategoriaDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('Deve falhar se tipos forem inválidos', async () => {
    const dto = new CreateCategoriaDto();
    // @ts-expect-error
    dto.nome = 123;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
