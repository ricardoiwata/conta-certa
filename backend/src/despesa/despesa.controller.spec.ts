import { Test, TestingModule } from '@nestjs/testing';
import { DespesaController } from './despesa.controller';
import { DespesaService } from './despesa.service';

describe('DespesaController', () => {
  let controller: DespesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DespesaController],
      providers: [DespesaService],
    }).compile();

    controller = module.get<DespesaController>(DespesaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
