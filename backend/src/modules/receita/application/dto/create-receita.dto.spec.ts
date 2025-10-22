import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateReceitaDto } from './create-receita.dto';

describe('CreateReceitaDto', () => {
  it('deve validar um DTO correto com sucesso', async () => {
    const dto = new CreateReceitaDto();
    dto.descricao = 'Salário Mensal';
    dto.valor = 5000;
    dto.data = '2025-10-14';
    dto.dataCompetencia = '2025-10-01';
    dto.origem = 'Fixo';
    dto.recorrentePai = false;
    dto.realizada = true;
    dto.usuarioUid = 'user-xyz-456';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar a validação se campos obrigatórios estiverem faltando', async () => {
    const dto = new CreateReceitaDto();
    dto.descricao = 'Incompleto';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const valorError = errors.find((err) => err.property === 'valor');
    expect(valorError).toBeDefined();
  });

  it('deve transformar a data de dd/mm/yyyy para yyyy-mm-dd', async () => {
    const plainDto = {
      data: '14/10/2025',
      dataCompetencia: '01/10/2025',
      // ...outros campos obrigatórios para passar na validação
      descricao: 'Teste',
      valor: 1,
      origem: 'Variável',
      recorrentePai: false,
      realizada: true,
      usuarioUid: 'user-xyz-456',
    };

    const dtoInstance = plainToInstance(CreateReceitaDto, plainDto);
    const errors = await validate(dtoInstance);
    
    expect(errors.length).toBe(0);
    expect(dtoInstance.data).toBe('2025-10-14');
    expect(dtoInstance.dataCompetencia).toBe('2025-10-01');
  });
});