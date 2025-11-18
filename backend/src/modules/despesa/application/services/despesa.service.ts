import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaDto } from '../dto/create-despesa.dto';
import { UpdateDespesaDto } from '../dto/update-despesa.dto';
import { Despesa } from '../../domain/entities/despesa.entity';
import { Categoria } from '../../../categoria/domain/entities/categoria.entity';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>,
  ) {}

  async create(createDespesaDto: CreateDespesaDto) {
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
      categoria,
      data: new Date(createDespesaDto.data),
    });

    return this.despesaRepository.save(despesa);
  }

  async findAll(firebaseUid?: string) {
    if (firebaseUid) {
      return await this.despesaRepository.find({
        where: { usuarioUid: firebaseUid },
        relations: ['categoria'],
      });
    }
    return await this.despesaRepository.find({
      relations: ['categoria'],
    });
  }

  async findAllRecorrentes(firebaseUid?: string) {
    if (firebaseUid) {
      return await this.despesaRepository.find({
        where: { recorrentePai: true, usuarioUid: firebaseUid },
        relations: ['categoria'],
      });
    }
    return await this.despesaRepository.find({
      where: { recorrentePai: true },
      relations: ['categoria'],
    });
  }

  async findAllRecorrentesFilhas(id: number, firebaseUid?: string) {
    if (firebaseUid) {
      return await this.despesaRepository.find({
        where: { recorrentePaiId: id, usuarioUid: firebaseUid },
      });
    }
    return await this.despesaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number, firebaseUid?: string) {
    const where: any = { id };
    if (firebaseUid) {
      where.usuarioUid = firebaseUid;
    }
    const despesa = await this.despesaRepository.findOne({
      where,
      relations: ['categoria'],
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
