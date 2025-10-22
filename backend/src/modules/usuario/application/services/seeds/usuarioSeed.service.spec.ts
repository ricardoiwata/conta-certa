import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioSeedService } from './usuarioSeed.service';
import { Usuario } from '../../../domain/entities/usuario.entity';

const mockUsuarioRepo = {
  count: jest.fn(),
  save: jest.fn(),
};

describe('UsuarioSeedService', () => {
  let service: UsuarioSeedService;
  let repository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioSeedService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepo,
        },
      ],
    }).compile();

    service = module.get<UsuarioSeedService>(UsuarioSeedService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    jest.clearAllMocks();
  });

  it('deve popular o banco com usuários se estiver vazio', async () => {
    mockUsuarioRepo.count.mockResolvedValue(0);

    await service.onModuleInit();

    expect(mockUsuarioRepo.count).toHaveBeenCalledTimes(1);
    expect(mockUsuarioRepo.save).toHaveBeenCalled();
  });

  it('deve evitar duplicações se o banco já tiver usuários', async () => {
    mockUsuarioRepo.count.mockResolvedValue(5);

    await service.onModuleInit();

    expect(mockUsuarioRepo.count).toHaveBeenCalledTimes(1);
    expect(mockUsuarioRepo.save).not.toHaveBeenCalled();
  });
});