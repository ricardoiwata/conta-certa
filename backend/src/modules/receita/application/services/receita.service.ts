import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceitaDto } from '../dto/create-receita.dto';
import { UpdateReceitaDto } from '../dto/update-receita.dto';
import { Receita } from '../../domain/entities/receita.entity';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import { Categoria } from 'src/modules/categoria/domain/entities/categoria.entity';

@Injectable()
export class ReceitaService {
  constructor(
    @InjectRepository(Receita)
    private receitaRepository: Repository<Receita>,
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async create(createReceitaDto: CreateReceitaDto) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: createReceitaDto.usuarioId },
    });

    if (!usuario)
      throw new NotFoundException(
        `User com id #${createReceitaDto.usuarioId} não encontrado`,
      );

    const receita = this.receitaRepository.create({
      ...createReceitaDto,
      usuario,
      data: new Date(createReceitaDto.data),
    });

    return this.receitaRepository.save(receita);
  }

  async findAll() {
    return await this.receitaRepository.find({
      relations: ['usuario', 'categoria'],
    });
  }

  async findAllRecorrentes() {
    return await this.receitaRepository.find({
      where: { recorrentePai: true },
      relations: ['categoria'],
    });
  }

  async findAllRecorrentesFilhas(id: number) {
    return await this.receitaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number) {
    const receita = await this.receitaRepository.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    });

    if (!receita) throw new NotFoundException(`Receita #${id} não encontrada`);

    return receita;
  }

  async update(id: number, updateReceitaDto: UpdateReceitaDto) {
    this.findOne(id);

    await this.receitaRepository.update(id, updateReceitaDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.receitaRepository.delete(id);
  }
}
