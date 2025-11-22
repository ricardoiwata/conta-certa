import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { Receita } from 'src/modules/receita/domain/entities/receita.entity';
import { Despesa } from 'src/modules/despesa/domain/entities/despesa.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let mockReceitaRepository: any;
  let mockDespesaRepository: any;

  beforeEach(async () => {
    mockReceitaRepository = {
      find: jest.fn().mockResolvedValue([]),
    };

    mockDespesaRepository = {
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Receita),
          useValue: mockReceitaRepository,
        },
        {
          provide: getRepositoryToken(Despesa),
          useValue: mockDespesaRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data for valid user', async () => {
      const firebaseUid = 'test-user-123';

      const result = await service.getDashboardData(firebaseUid);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('balance');
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('receita');
      expect(result).toHaveProperty('despesa');
      expect(result).toHaveProperty('alertas');
    });

    it('should handle empty data', async () => {
      mockReceitaRepository.find.mockResolvedValue([]);
      mockDespesaRepository.find.mockResolvedValue([]);

      const result = await service.getDashboardData('test-user');

      expect(result.balance).toBe(0);
      expect(result.totalReceitasRecebidas).toBe(0);
      expect(result.totalDespesasPagas).toBe(0);
    });

    it('should calculate correct balance', async () => {
      const receitas = [
        {
          id: 1,
          descricao: 'Salário',
          valor: 5000,
          data: new Date().toISOString(),
          realizada: true,
          usuarioUid: 'test-user',
        },
      ];

      const despesas = [
        {
          id: 1,
          descricao: 'Aluguel',
          valor: 1500,
          data: new Date().toISOString(),
          realizada: true,
          usuarioUid: 'test-user',
        },
      ];

      mockReceitaRepository.find.mockResolvedValue(receitas);
      mockDespesaRepository.find.mockResolvedValue(despesas);

      const result = await service.getDashboardData('test-user');

      expect(result.balance).toBe(3500);
      expect(result.totalReceitasRecebidas).toBe(5000);
      expect(result.totalDespesasPagas).toBe(1500);
    });

    it('should include pending items', async () => {
      const receitas = [
        {
          id: 1,
          descricao: 'Freelance',
          valor: 1000,
          data: new Date().toISOString(),
          realizada: false,
          usuarioUid: 'test-user',
        },
      ];

      mockReceitaRepository.find.mockResolvedValue(receitas);
      mockDespesaRepository.find.mockResolvedValue([]);

      const result = await service.getDashboardData('test-user');

      expect(result.receitasPendentes).toBe(1000);
    });
  });

  describe('getIncomeVsExpenseDetail', () => {
    it('should return income vs expense detail', async () => {
      mockReceitaRepository.find.mockResolvedValue([]);
      mockDespesaRepository.find.mockResolvedValue([]);

      const result = await service.getIncomeVsExpenseDetail('test-user');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('periods');
      expect(result).toHaveProperty('defaultPeriod');
    });
  });
});
