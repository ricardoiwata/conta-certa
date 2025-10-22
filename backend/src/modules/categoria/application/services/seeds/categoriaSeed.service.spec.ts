import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaSeedService } from './categoriaSeed.service';
import { Categoria } from '../../../domain/entities/categoria.entity';
import { Repository } from 'typeorm';

describe('CategoriaSeedService', () => {
  let service: CategoriaSeedService;
  let mockRepo: jest.Mocked<Repository<Categoria>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaSeedService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: {
            count: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriaSeedService>(CategoriaSeedService);
    mockRepo = module.get(getRepositoryToken(Categoria));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve popular o banco com categorias padrão se estiver vazio', async () => {
    mockRepo.count.mockResolvedValue(0);

    await service.onModuleInit();

    expect(mockRepo.count).toHaveBeenCalledTimes(1);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('Deve evitar duplicações se o banco já tiver categorias', async () => {
    mockRepo.count.mockResolvedValue(5);

    await service.onModuleInit();

    expect(mockRepo.count).toHaveBeenCalledTimes(1);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});