import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaService } from './receita.service';
import { Receita } from '../../domain/entities/receita.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateReceitaDto } from '../dto/create-receita.dto';

const mockReceitaRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(), // Usando a sintaxe moderna
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ReceitaService', () => {
  let service: ReceitaService;
  let receitaRepository: Repository<Receita>;

  const mockReceita: Receita = {
    id: 1,
    descricao: 'Salário',
    valor: 5000,
    data: new Date(),
    dataCompetencia: new Date(),
    origem: 'Fixo',
    recorrentePai: false,
    recorrentePaiId: null,
    realizada: true,
    usuarioUid: 'test-uid',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceitaService,
        {
          provide: getRepositoryToken(Receita),
          useValue: mockReceitaRepo,
        },
      ],
    }).compile();

    service = module.get<ReceitaService>(ReceitaService);
    receitaRepository = module.get<Repository<Receita>>(getRepositoryToken(Receita));

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar uma receita com sucesso', async () => {
      const createDto: CreateReceitaDto = {
        descricao: 'Salário',
        valor: 5000,
        data: '2025-10-14',
        dataCompetencia: '2025-10-01',
        origem: 'Fixo',
        recorrentePai: false,
        realizada: true,
        usuarioUid: 'test-uid',
      };

      mockReceitaRepo.create.mockReturnValue(mockReceita);
      mockReceitaRepo.save.mockResolvedValue(mockReceita);

      // Simulando a lógica de serviço aprimorada
      const serviceImpl = service.create.toString();
      const expectsDataCompetencia = serviceImpl.includes('dataCompetencia');
      
      const expectedCreateObject = {
        ...createDto,
        data: new Date(createDto.data),
        // O serviço deve converter ambos os campos de data
        ...(expectsDataCompetencia && { dataCompetencia: new Date(createDto.dataCompetencia) }),
      };

      const result = await service.create(createDto);

      expect(mockReceitaRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Date),
        dataCompetencia: expect.any(Date)
      }));
      expect(mockReceitaRepo.save).toHaveBeenCalledWith(mockReceita);
      expect(result).toEqual(mockReceita);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de receitas', async () => {
      mockReceitaRepo.find.mockResolvedValue([mockReceita]);
      const result = await service.findAll();
      expect(result).toEqual([mockReceita]);
      expect(mockReceitaRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma única receita', async () => {
      mockReceitaRepo.findOneBy.mockResolvedValue(mockReceita);
      const result = await service.findOne(1);
      expect(result).toEqual(mockReceita);
      expect(mockReceitaRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve lançar NotFoundException se a receita não for encontrada', async () => {
      mockReceitaRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('update', () => {
    it('deve atualizar uma receita e retorná-la', async () => {
      const updateDto = { descricao: 'Pagamento Freelance' };
      const updatedReceita = { ...mockReceita, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockReceita).mockResolvedValueOnce(updatedReceita);
      mockReceitaRepo.update.mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockReceitaRepo.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.descricao).toEqual('Pagamento Freelance');
    });
  });

  describe('remove', () => {
    it('deve remover uma receita com sucesso', async () => {
      const deleteResult = { affected: 1, raw: [] };
      mockReceitaRepo.delete.mockResolvedValue(deleteResult);
      
      const result = await service.remove(1);

      expect(mockReceitaRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });
  });

  // Testes para os métodos de recorrência
  describe('findAllRecorrentes', () => {
    it('deve retornar apenas receitas recorrentes pai', async () => {
        const recorrente = {...mockReceita, recorrentePai: true};
        mockReceitaRepo.find.mockResolvedValue([recorrente]);

        const result = await service.findAllRecorrentes();

        expect(mockReceitaRepo.find).toHaveBeenCalledWith({
            where: { recorrentePai: true },
        });
        expect(result[0].recorrentePai).toBe(true);
    });
  });

  describe('findAllRecorrentesFilhas', () => {
    it('deve retornar receitas filhas de um recorrente pai', async () => {
        const filha = {...mockReceita, recorrentePaiId: 5};
        mockReceitaRepo.find.mockResolvedValue([filha]);

        const result = await service.findAllRecorrentesFilhas(5);

        expect(mockReceitaRepo.find).toHaveBeenCalledWith({
            where: { recorrentePaiId: 5 },
        });
        expect(result[0].recorrentePaiId).toBe(5);
    });
  });
});