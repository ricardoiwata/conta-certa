import { validate } from 'class-validator';
import { UpdateCategoriaDto } from './update-categoria.dto';

describe('UpdateCategoriaDto', () => {
  it('Deve validar corretamente campos opcionais', async () => {
    const dto = new UpdateCategoriaDto();
    dto.nomeCategoria = 'Transporte';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Deve falhar se tipo for inválido', async () => {
    const dto = new UpdateCategoriaDto();
    // @ts-expect-error
    dto.nomeCategoria = 999;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
