import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../../domain/entities/usuario.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';

const mockUsuarioRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  const mockUsuario: Usuario = { id: 1, nome: 'João Teste', email: 'joao@teste.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepo,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      const dto: CreateUsuarioDto = { nome: 'João Teste', email: 'joao@teste.com' };
      
      mockUsuarioRepo.create.mockReturnValue(mockUsuario);
      mockUsuarioRepo.save.mockResolvedValue(mockUsuario);

      const result = await service.create(dto);

      expect(mockUsuarioRepo.create).toHaveBeenCalledWith(dto);
      expect(mockUsuarioRepo.save).toHaveBeenCalledWith(mockUsuario);
      expect(result).toEqual(mockUsuario);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de usuários', async () => {
      mockUsuarioRepo.find.mockResolvedValue([mockUsuario]);
      
      const result = await service.findAll();
      
      expect(result).toEqual([mockUsuario]);
      expect(mockUsuarioRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um único usuário', async () => {
      mockUsuarioRepo.findOneBy.mockResolvedValue(mockUsuario);
      
      const result = await service.findOne(1);

      expect(result).toEqual(mockUsuario);
      expect(mockUsuarioRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      mockUsuarioRepo.findOneBy.mockResolvedValue(null);
      
      const result = await service.findOne(99);
      
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário e retorná-lo', async () => {
      const updateDto = { nome: 'João Atualizado' };
      const mockUsuario: Usuario = { id: 1, nome: 'João Teste', email: 'joao@teste.com' };
      const updatedUsuario = { ...mockUsuario, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUsuario);
      mockUsuarioRepo.update.mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);
      expect(result).not.toBeNull();

      if (result) {
        expect(result.nome).toEqual('João Atualizado');
      }  
    });
  });

  describe('remove', () => {
    it('deve remover um usuário com sucesso', async () => {
      const deleteResult = { affected: 1, raw: [] };
      mockUsuarioRepo.delete.mockResolvedValue(deleteResult);
      
      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockUsuarioRepo.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se o usuário a ser removido não for encontrado', async () => {
      const deleteResult = { affected: 0, raw: [] };
      mockUsuarioRepo.delete.mockResolvedValue(deleteResult);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});