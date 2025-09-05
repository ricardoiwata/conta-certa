import { Injectable, Inject } from '@nestjs/common';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../../domain/repositories/tokens';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly repo: IUsuarioRepository,
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return this.repo.create({
      nome: createUsuarioDto.nome,
      email: createUsuarioDto.email,
    });
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findById(id);
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.repo.update(id, updateUsuarioDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }
}
