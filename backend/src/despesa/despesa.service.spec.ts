import { Test, TestingModule } from '@nestjs/testing';
import { DespesaService } from './despesa.service';

describe('DespesaService', () => {
  let service: DespesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DespesaService],
    }).compile();

    service = module.get<DespesaService>(DespesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
