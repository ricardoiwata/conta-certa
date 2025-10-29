import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciasNotificacaoService } from './preferencias-notificacao.service';

describe('PreferenciasNotificacaoService', () => {
  let service: PreferenciasNotificacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenciasNotificacaoService],
    }).compile();

    service = module.get<PreferenciasNotificacaoService>(PreferenciasNotificacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
