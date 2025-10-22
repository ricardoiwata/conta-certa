import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from '../../application/services/categoria.service';
import { CreateCategoriaDto } from '../../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../../application/dto/update-categoria.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  let service: CategoriaService;

  const mockCategoria = { id: 1, nome: 'Alimentação' };
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [{ provide: CategoriaService, useValue: mockService }],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    service = module.get<CategoriaService>(CategoriaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('Deve criar uma categoria válida (POST /categoria)', async () => {
    const dto: CreateCategoriaDto = { nomeCategoria: 'Alimentação' };
    mockService.create.mockResolvedValue(mockCategoria);
    const result = await controller.create(dto);
    expect(result).toEqual(mockCategoria);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('Deve retornar erro 400 para dados inválidos', async () => {
    const dto = { nome: '' } as any;
    mockService.create.mockRejectedValue(new BadRequestException());
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('Deve listar todas as categorias (GET /categoria)', async () => {
    mockService.findAll.mockResolvedValue([mockCategoria]);
    const result = await controller.findAll();
    expect(result).toEqual([mockCategoria]);
  });

  it('Deve buscar uma categoria por ID (GET /categoria/:id)', async () => {
    mockService.findOne.mockResolvedValue(mockCategoria);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockCategoria);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('Deve retornar 404 se o ID não existir', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('Deve atualizar uma categoria existente (PATCH /categoria/:id)', async () => {
    const dto: UpdateCategoriaDto = { nomeCategoria: 'Transporte' };
    mockService.update.mockResolvedValue({ id: 1, nomeCategoria: 'Transporte' });
    const result = await controller.update('1', dto);
    expect(result.nomeCategoria).toBe('Transporte');
  });

  it('Deve excluir uma categoria (DELETE /categoria/:id)', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove('1');
    expect(result).toEqual({ deleted: true });
  });
});
