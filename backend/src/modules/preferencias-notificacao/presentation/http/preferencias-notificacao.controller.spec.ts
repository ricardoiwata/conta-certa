import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciasNotificacaoController } from './preferencias-notificacao.controller';
import { PreferenciasNotificacaoService } from '../../application/services/preferencias-notificacao.service';

describe('PreferenciasNotificacaoController', () => {
  let controller: PreferenciasNotificacaoController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferenciasNotificacaoController],
      providers: [
        {
          provide: PreferenciasNotificacaoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PreferenciasNotificacaoController>(PreferenciasNotificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
