import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciasNotificacaoController } from './preferencias-notificacao.controller';
import { PreferenciasNotificacaoService } from './preferencias-notificacao.service';

describe('PreferenciasNotificacaoController', () => {
  let controller: PreferenciasNotificacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferenciasNotificacaoController],
      providers: [PreferenciasNotificacaoService],
    }).compile();

    controller = module.get<PreferenciasNotificacaoController>(PreferenciasNotificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
