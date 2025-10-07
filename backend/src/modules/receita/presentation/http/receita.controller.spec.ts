import { Test, TestingModule } from '@nestjs/testing';
import { ReceitaController } from './receita.controller';
import { ReceitaService } from '../../application/services/receita.service';

describe('ReceitaController', () => {
  let controller: ReceitaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceitaController],
      providers: [ReceitaService],
    }).compile();

    controller = module.get<ReceitaController>(ReceitaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
