import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from '../dto/create-despesa.dto';
import { UpdateDespesaDto } from '../dto/update-despesa.dto';
import { Despesa } from '../../domain/entities/despesa.entity';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import { Categoria } from 'src/modules/categoria/domain/entities/categoria.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>,
  ) {}

  async create(createDespesaDto: CreateDespesaDto) {
    const usuario = await this.usuarioRepositorio.findOne({
      where: { id: createDespesaDto.usuarioId },
    });

    if (!usuario)
      throw new NotFoundException(
        `User com id #${createDespesaDto.usuarioId} não encontrado`,
      );

    const categoria = await this.categoriaRepositorio.findOne({
      where: { id: createDespesaDto.categoriaId },
    });

    if (!categoria) {
      throw new NotFoundException(
        `Categoria com id #${createDespesaDto.categoriaId} não encontrada`,
      );
    }

    const despesa = this.despesaRepository.create({
      ...createDespesaDto,
      usuario,
      categoria,
      data: new Date(createDespesaDto.data),
    });

    return this.despesaRepository.save(despesa);
  }

  async findAll() {
    return await this.despesaRepository.find({
      relations: ['usuario', 'categoria'],
    });
  }

  async findAllRecorrentes() {
    return await this.despesaRepository.find({
      where: { recorrentePai: true },
      relations: ['categoria'],
    });
  }

  async findAllRecorrentesFilhas(id: number) {
    return await this.despesaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number) {
    const despesa = await this.despesaRepository.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    });

    if (!despesa) throw new NotFoundException(`Despesa #${id} não encontrada`);

    return despesa;
  }

  async update(id: number, updateDespesaDto: UpdateDespesaDto) {
    this.findOne(id);

    await this.despesaRepository.update(id, updateDespesaDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.despesaRepository.delete(id);
  }
}
