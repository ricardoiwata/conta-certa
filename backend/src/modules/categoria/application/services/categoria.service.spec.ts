import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { Repository } from 'typeorm';
import { Categoria } from '../../domain/entities/categoria.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repo: Repository<Categoria>;

  const mockCategoria = { id: 1, nomeCategoria: 'Alimentação' } as Categoria;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        { provide: getRepositoryToken(Categoria), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repo = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
  });

  afterEach(() => jest.clearAllMocks());

  it('Deve chamar o repositório para criar uma categoria', async () => {
    mockRepo.create.mockReturnValue(mockCategoria);
    mockRepo.save.mockResolvedValue(mockCategoria);
    const result = await service.create({ nomeCategoria: 'Alimentação' });
    expect(result).toEqual(mockCategoria);
  });

  it('Deve lançar erro se já existir uma categoria com o mesmo nome', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockCategoria);
    await expect(service.create({ nomeCategoria: 'Alimentação' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('Deve retornar todas as categorias', async () => {
    mockRepo.find.mockResolvedValue([mockCategoria]);
    const result = await service.findAll();
    expect(result).toEqual([mockCategoria]);
  });

  it('Deve retornar uma categoria por ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockCategoria);
    const result = await service.findOne(1);
    expect(result).toEqual(mockCategoria);
  });

  it('Deve lançar erro se o ID não existir', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('Deve atualizar uma categoria corretamente', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockCategoria);
    mockRepo.save.mockResolvedValue({ id: 1, nomeCategoria: 'Transporte' });
    const result = await service.update(1, { nomeCategoria: 'Transporte' });
    expect(result.nomeCategoria).toBe('Transporte');
  });

  it('Deve remover uma categoria e confirmar exclusão', async () => {
    mockRepo.findOneBy.mockResolvedValue(mockCategoria);
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({ deleted: true });
  });
});
