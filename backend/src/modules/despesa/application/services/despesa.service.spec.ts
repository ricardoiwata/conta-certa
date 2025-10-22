import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesaService } from './despesa.service';
import { Despesa } from '../../domain/entities/despesa.entity';
import { Categoria } from '../../../categoria/domain/entities/categoria.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateDespesaDto } from '../dto/create-despesa.dto';

const mockDespesaRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockCategoriaRepo = {
  findOne: jest.fn(),
};

describe('DespesaService', () => {
  let service: DespesaService;
  let despesaRepository: Repository<Despesa>;
  let categoriaRepository: Repository<Categoria>;

  const mockCategoria: Categoria = { id: 1, nomeCategoria: 'Alimentação', despesa: [] };
  const mockDespesa: Despesa = {
    id: 1,
    descricao: 'Almoço',
    valor: 25.5,
    data: new Date(),
    formaPagamento: 'Débito',
    recorrentePai: false,
    realizada: true,
    usuarioUid: 'test-uid',
    categoriaId: 1,
    categoria: mockCategoria,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DespesaService,
        { provide: getRepositoryToken(Despesa), useValue: mockDespesaRepo },
        { provide: getRepositoryToken(Categoria), useValue: mockCategoriaRepo },
      ],
    }).compile();

    service = module.get<DespesaService>(DespesaService);
    despesaRepository = module.get<Repository<Despesa>>(getRepositoryToken(Despesa));
    categoriaRepository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar uma despesa com sucesso', async () => {
      const createDto: CreateDespesaDto = {
        descricao: 'Almoço',
        valor: 25.5,
        data: '2025-10-13',
        formaPagamento: 'Débito',
        recorrentePai: false,
        realizada: true,
        usuarioUid: 'test-uid',
        categoriaId: 1,
      };

      mockCategoriaRepo.findOne.mockResolvedValue(mockCategoria);
      mockDespesaRepo.create.mockReturnValue(mockDespesa);
      mockDespesaRepo.save.mockResolvedValue(mockDespesa);

      const result = await service.create(createDto);

      expect(mockCategoriaRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockDespesa);
    });

    it('deve lançar NotFoundException se a categoria não existir', async () => {
      const createDto: CreateDespesaDto = {
        descricao: 'Almoço',
        valor: 25.5,
        data: '2025-10-13',
        formaPagamento: 'Débito',
        recorrentePai: false,
        realizada: true,
        usuarioUid: 'test-uid',
        categoriaId: 99,
      };
      mockCategoriaRepo.findOne.mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma única despesa', async () => {
      mockDespesaRepo.findOne.mockResolvedValue(mockDespesa);
      const result = await service.findOne(1);
      expect(result).toEqual(mockDespesa);
    });
  });

});