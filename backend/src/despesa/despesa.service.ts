import { Injectable } from '@nestjs/common';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Injectable()
export class DespesaService {
  create(createDespesaDto: CreateDespesaDto) {
    return 'This action adds a new despesa';
  }

  findAll() {
    return `This action returns all despesa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} despesa`;
  }

  update(id: number, updateDespesaDto: UpdateDespesaDto) {
    return `This action updates a #${id} despesa`;
  }

  remove(id: number) {
    return `This action removes a #${id} despesa`;
  }
}
