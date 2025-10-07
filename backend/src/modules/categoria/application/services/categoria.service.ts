import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { Categoria } from '../../domain/entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepositorio: Repository<Categoria>,
  ) {}
  async findAll() {
    return await this.categoriaRepositorio.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepositorio.findOne({
      where: { id },
    });

    if (!categoria)
      throw new NotFoundException(`Categoria #${id} não encontrada`);

    return categoria;
  }
}
