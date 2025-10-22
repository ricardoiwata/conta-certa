import { Test, TestingModule } from '@nestjs/testing';
import { DespesaController } from './despesa.controller';
import { DespesaService } from '../../application/services/despesa.service';
import { CreateDespesaDto } from '../../application/dto/create-despesa.dto';
import { UpdateDespesaDto } from '../../application/dto/update-despesa.dto';

describe('DespesaController', () => {
  let controller: DespesaController;
  let service: DespesaService;

  const mockDespesaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllRecorrentes: jest.fn(),
    findAllRecorrentesFilhas: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockDespesa = { id: 1, descricao: 'Teste' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DespesaController],
      providers: [
        {
          provide: DespesaService,
          useValue: mockDespesaService,
        },
      ],
    }).compile();

    controller = module.get<DespesaController>(DespesaController);
    service = module.get<DespesaService>(DespesaService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar service.create ao criar uma despesa', () => {
    const dto = new CreateDespesaDto();
    mockDespesaService.create.mockResolvedValue(mockDespesa);

    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve chamar service.findAll ao buscar todas as despesas', () => {
    mockDespesaService.findAll.mockResolvedValue([mockDespesa]);
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('deve chamar service.findAllRecorrentes', () => {
    controller.findAllRecorrentes();
    expect(service.findAllRecorrentes).toHaveBeenCalled();
  });

  it('deve chamar service.findAllRecorrentesFilhas com o ID correto', () => {
    controller.findAllRecorrentesFilhas('5');
    expect(service.findAllRecorrentesFilhas).toHaveBeenCalledWith(5);
  });

  it('deve chamar service.findOne com o ID correto', () => {
    mockDespesaService.findOne.mockResolvedValue(mockDespesa);
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('deve chamar service.update com os parâmetros corretos', () => {
    const dto = new UpdateDespesaDto();
    mockDespesaService.update.mockResolvedValue({ ...mockDespesa, ...dto });
    controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('deve chamar service.remove com o ID correto', () => {
    mockDespesaService.remove.mockResolvedValue({ affected: 1 });
    controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});