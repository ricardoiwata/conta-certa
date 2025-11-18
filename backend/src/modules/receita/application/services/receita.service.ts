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
      dataCompetencia: new Date(createReceitaDto.dataCompetencia),
    });

    return this.receitaRepository.save(receita);
  }

  async findAll(firebaseUid?: string) {
    if (firebaseUid) {
      return await this.receitaRepository.find({
        where: { usuarioUid: firebaseUid },
      });
    }
    return await this.receitaRepository.find();
  }

  async findAllRecorrentes(firebaseUid?: string) {
    if (firebaseUid) {
      return await this.receitaRepository.find({
        where: { recorrentePai: true, usuarioUid: firebaseUid },
      });
    }
    return await this.receitaRepository.find({
      where: { recorrentePai: true },
    });
  }

  async findAllRecorrentesFilhas(id: number, firebaseUid?: string) {
    if (firebaseUid) {
      return await this.receitaRepository.find({
        where: { recorrentePaiId: id, usuarioUid: firebaseUid },
      });
    }
    return await this.receitaRepository.find({
      where: { recorrentePaiId: id },
    });
  }

  async findOne(id: number, firebaseUid?: string) {
    const where: any = { id };
    if (firebaseUid) {
      where.usuarioUid = firebaseUid;
    }
    const receita = await this.receitaRepository.findOneBy(where);

    if (!receita) throw new NotFoundException(`Receita #${id} não encontrada`);

    return receita;
  }

  async update(id: number, updateReceitaDto: UpdateReceitaDto) {
    await this.findOne(id);

    await this.receitaRepository.update(id, updateReceitaDto);

    return this.findOne(id);
  }

  remove(id: number) {
    return this.receitaRepository.delete(id);
  }
}