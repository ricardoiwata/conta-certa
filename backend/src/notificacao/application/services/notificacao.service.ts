import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from '../dto/update-notificacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notificacao } from 'src/notificacao/domain/entities/notificacao.entity';
import { In, Repository } from 'typeorm';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao)
    private notificacaoRepository: Repository<Notificacao>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createNotificacaoDto: CreateNotificacaoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: createNotificacaoDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(
        `User com id #${createNotificacaoDto.usuarioId} não encontrado`,
      );
    }

    const notificacao = this.notificacaoRepository.create({
      ...createNotificacaoDto,
      usuario,
    });

    return this.notificacaoRepository.save(notificacao);
  }

  async findOne(id: number) {
    const notificacao = await this.notificacaoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!notificacao)
      throw new NotFoundException(`notificacao #${id} não encontrada`);

    return notificacao;
  }
  async findAllByUser(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundException(`User com id #${userId} não encontrado`);
    }

    const notificacoes = await this.notificacaoRepository.find({
      where: { usuarioId: userId },
      relations: ['usuario'],
    });

    if (!notificacoes)
      throw new NotFoundException(`notificacao #${userId} não encontrada`);

    return notificacoes;
  }
  async findAllActivesByUser(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundException(`User com id #${userId} não encontrado`);
    }

    const notificacoes = await this.notificacaoRepository.find({
      where: { usuarioId: userId, ativa: true },
      relations: ['usuario'],
    });

    if (!notificacoes)
      throw new NotFoundException(`notificacao #${userId} não encontrada`);

    return notificacoes;
  }

  async deactivate(id: number) {
    await this.findOne(id);

    await this.notificacaoRepository.update(id, { ativa: false });

    return this.findOne(id);
  }

  // Deleta logicamente várias notificações por ids
  async deactivateMany(ids: number[]) {
    if (!ids || ids.length === 0) return [];

    await this.notificacaoRepository.update({ id: In(ids) }, { ativa: false });

    return this.notificacaoRepository.find({
      where: { id: In(ids) },
      relations: ['usuario'],
    });
  }

  // Deleta logicamente todas as notificações de um usuário
  async deactivateAllByUser(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });
    if (!usuario)
      throw new NotFoundException(`User com id #${userId} não encontrado`);

    await this.notificacaoRepository.update(
      { usuarioId: userId },
      { ativa: false },
    );

    return this.notificacaoRepository.find({
      where: { usuarioId: userId },
      relations: ['usuario'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} notificacao`;
  }
}
