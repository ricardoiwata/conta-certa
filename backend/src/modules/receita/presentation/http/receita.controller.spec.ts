import { Test, TestingModule } from '@nestjs/testing';
import { ReceitaController } from './receita.controller';
import { ReceitaService } from '../../application/services/receita.service';
import { CreateReceitaDto } from '../../application/dto/create-receita.dto';
import { UpdateReceitaDto } from '../../application/dto/update-receita.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

describe('ReceitaController', () => {
  let controller: ReceitaController;
  let service: ReceitaService;

  const mockReceitaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllRecorrentes: jest.fn(),
    findAllRecorrentesFilhas: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReceita = { id: 1, descricao: 'Salário' };
  const mockRequest = { firebaseUid: 'test-uid' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceitaController],
      providers: [
        {
          provide: ReceitaService,
          useValue: mockReceitaService,
        },
        {
          provide: FirebaseAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<ReceitaController>(ReceitaController);
    service = module.get<ReceitaService>(ReceitaService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar service.create ao criar uma receita', () => {
    const dto = new CreateReceitaDto();
    mockReceitaService.create.mockResolvedValue(mockReceita);

    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve chamar service.findAll ao buscar todas as receitas', () => {
    mockReceitaService.findAll.mockResolvedValue([mockReceita]);
    controller.findAll(mockRequest);
    expect(service.findAll).toHaveBeenCalled();
  });
  
  it('deve chamar service.findAllRecorrentes', () => {
    mockReceitaService.findAllRecorrentes.mockResolvedValue([]);
    controller.findAllRecorrentes(mockRequest);
    expect(service.findAllRecorrentes).toHaveBeenCalled();
  });

  it('deve chamar service.findAllRecorrentesFilhas com o ID correto', () => {
    mockReceitaService.findAllRecorrentesFilhas.mockResolvedValue([]);
    controller.findAllRecorrentesFilhas('5', mockRequest);
    expect(service.findAllRecorrentesFilhas).toHaveBeenCalledWith(5, 'test-uid');
  });

  it('deve chamar service.findOne com o ID correto', () => {
    mockReceitaService.findOne.mockResolvedValue(mockReceita);
    controller.findOne('1', mockRequest);
    expect(service.findOne).toHaveBeenCalledWith(1, 'test-uid');
  });

  it('deve chamar service.update com os parâmetros corretos', () => {
    const dto = new UpdateReceitaDto();
    mockReceitaService.update.mockResolvedValue({ ...mockReceita, ...dto });
    controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('deve chamar service.remove com o ID correto', () => {
    mockReceitaService.remove.mockResolvedValue({ affected: 1 });
    controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});