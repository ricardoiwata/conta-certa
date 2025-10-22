import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDespesaDto } from './create-despesa.dto';

describe('CreateDespesaDto', () => {
  it('deve validar um DTO correto com sucesso', async () => {
    const dto = new CreateDespesaDto();
    dto.descricao = 'Compra no mercado';
    dto.valor = 150.75;
    dto.data = '2025-10-13';
    dto.formaPagamento = 'Crédito';
    dto.recorrentePai = false;
    dto.realizada = true;
    dto.usuarioUid = 'user-abc-123';
    dto.categoriaId = 1;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar a validação se campos obrigatórios estiverem faltando', async () => {
    const dto = new CreateDespesaDto();
    dto.descricao = 'Incompleto';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const dataError = errors.find((err) => err.property === 'data');
    expect(dataError).toBeDefined();
  });

  it('deve transformar a data de dd/mm/yyyy para yyyy-mm-dd', async () => {
    const plainDto = {
      descricao: 'Compra',
      valor: 100,
      data: '13/10/2025', // Formato brasileiro
      formaPagamento: 'Pix',
      recorrentePai: false,
      realizada: true,
      usuarioUid: 'user-abc-123',
      categoriaId: 1,
    };

    const dtoInstance = plainToInstance(CreateDespesaDto, plainDto);

    const errors = await validate(dtoInstance);
    expect(errors.length).toBe(0);

    expect(dtoInstance.data).toBe('2025-10-13');
});

  it('deve falhar se a data for inválida', async () => {
    const dto = new CreateDespesaDto();
    dto.descricao = 'Compra';
    dto.valor = 100;
    dto.data = 'data-invalida';
    dto.formaPagamento = 'Dinheiro';
    dto.recorrentePai = false;
    dto.realizada = true;
    dto.usuarioUid = 'user-abc-123';
    dto.categoriaId = 1;

    const errors = await validate(dto);
    const dataError = errors.find((err) => err.property === 'data');
    expect(dataError).toBeDefined();
  });
});