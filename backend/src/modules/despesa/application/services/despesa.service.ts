import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Despesa } from '../../domain/entities/despesa.entity';
import { CreateDespesaDto } from '../dto/create-despesa.dto';
import { UpdateDespesaDto } from '../dto/update-despesa.dto';

@Injectable()
export class DespesaService {
  constructor(
    @InjectRepository(Despesa)
    private readonly despesaRepository: Repository<Despesa>,
  ) {}

  async create(createDespesaDto: CreateDespesaDto): Promise<Despesa> {
    const despesa = this.despesaRepository.create(createDespesaDto);
    return this.despesaRepository.save(despesa);
  }

  async findAll(): Promise<Despesa[]> {
    return this.despesaRepository.find();
  }

  async findOne(id: number): Promise<Despesa | null> {
    return this.despesaRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateDespesaDto: UpdateDespesaDto,
  ): Promise<Despesa | null> {
    await this.despesaRepository.update(id, updateDespesaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.despesaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Despesa #${id} não encontrado`);
    }
  }
}
