import { Injectable, Inject } from '@nestjs/common';
import { CreateDespesaDto } from '../dto/create-despesa.dto';
import { UpdateDespesaDto } from '../dto/update-despesa.dto';
import { IDespesaRepository } from '../../domain/repositories/despesa.repository';
import { DESPESA_REPOSITORY } from '../../domain/repositories/tokens';
import { Despesa } from '../../domain/entities/despesa';

@Injectable()
export class DespesaService {
  constructor(
    @Inject(DESPESA_REPOSITORY)
    private readonly repo: IDespesaRepository,
  ) {}

  create(createDespesaDto: CreateDespesaDto) {
    const data = {
      descricao: createDespesaDto.descricao,
      valor: createDespesaDto.valor,
      data: new Date(createDespesaDto.data),
      usuarioId: createDespesaDto.usuarioId,
    };
    return this.repo.create(data);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findById(id);
  }

  update(id: number, updateDespesaDto: UpdateDespesaDto) {
    const payload: Partial<Omit<Despesa, 'id'>> = {
      descricao: updateDespesaDto.descricao,
      valor: updateDespesaDto.valor,
      data: updateDespesaDto.data ? new Date(updateDespesaDto.data) : undefined,
      usuarioId: updateDespesaDto.usuarioId,
    };
    return this.repo.update(id, payload);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }
}
