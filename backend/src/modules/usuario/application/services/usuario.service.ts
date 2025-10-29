import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { PreferenciasNotificacao } from 'src/modules/preferencias-notificacao/domain/entities/preferencias-notificacao.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(PreferenciasNotificacao)
    private readonly preferenciasNotificacaoRepository: Repository<PreferenciasNotificacao>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    const preferenciasNotificacao =
      await this.preferenciasNotificacaoRepository.create({
        usuarioId: usuario.id,
      });
    await this.preferenciasNotificacaoRepository.save(preferenciasNotificacao);

    console.log(
      await this.preferenciasNotificacaoRepository.findOneBy({
        id: preferenciasNotificacao.id,
      }),
    );

    return usuarioSalvo;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario | null> {
    await this.usuarioRepository.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario #${id} não encontrado`);
    }
  }
}
