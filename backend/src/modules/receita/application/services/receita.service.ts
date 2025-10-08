import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceitaDto } from '../dto/create-receita.dto';
import { UpdateReceitaDto } from '../dto/update-receita.dto';
import { Receita } from '../../domain/entities/receita.entity';

@Injectable()
export class ReceitaService {
  constructor(
    @InjectRepository(Receita)
    private receitaRepository: Repository<Receita>,
  ) {}

  async create(createReceitaDto: CreateReceitaDto) {
    const receita = this.receitaRepository.create({
      ...createReceitaDto,
      data: new Date(createReceitaDto.data),
    });

    return this.receitaRepository.save(receita);
  }

  async findAll() {
    return await this.receitaRepository.find();
  }

  async findAllRecorrentes() {
    return await this.receitaRepository.find({
      where: { recorrentePai: true },
    });
  }

  async findAllRecorrentesFilhas(id: number) {
    return await this.receitaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number) {
    const receita = await this.receitaRepository.findOne({ where: { id } });

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
