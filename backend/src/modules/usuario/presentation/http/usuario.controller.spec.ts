import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from '../../application/services/usuario.service';
import { CreateUsuarioDto } from '../../application/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../application/dto/update-usuario.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

const mockUsuarioService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const mockUsuario = { 
    id: 1, 
    nome: 'Teste', 
    email: 'teste@teste.com',
    firebaseUid: 'test-uid',
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    notificacoes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        {
          provide: FirebaseAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar service.create ao criar um usuário', () => {
    const dto = new CreateUsuarioDto();
    mockUsuarioService.create.mockResolvedValue(mockUsuario);

    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('deve chamar service.findAll ao buscar todos os usuários', () => {
    mockUsuarioService.findAll.mockResolvedValue([mockUsuario]);
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('deve chamar service.findOne com o ID correto', () => {
    mockUsuarioService.findOne.mockResolvedValue(mockUsuario);
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('deve chamar service.update com os parâmetros corretos', () => {
    const dto = new UpdateUsuarioDto();
    mockUsuarioService.update.mockResolvedValue({ ...mockUsuario, ...dto });
    controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('deve chamar service.remove com o ID correto', () => {
    mockUsuarioService.remove.mockResolvedValue(undefined);
    controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});