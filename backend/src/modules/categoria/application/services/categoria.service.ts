import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const categoria = await this.categoriaRepositorio.findOneBy({id});

    if (!categoria)
      throw new NotFoundException(`Categoria #${id} não encontrada`);

    return categoria;
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
  const categoriaExistente = await this.categoriaRepositorio.findOneBy({
    nomeCategoria: dto.nomeCategoria,
  });

  if (categoriaExistente) {
    throw new ConflictException(
      `Já existe uma categoria com o nome "${dto.nomeCategoria}"`,
    );
  }

  const novaCategoria = this.categoriaRepositorio.create(dto);
  return await this.categoriaRepositorio.save(novaCategoria);
}

async update(id: number, dto: UpdateCategoriaDto) {
  const categoria = await this.findOne(id);
  Object.assign(categoria, dto);
  return await this.categoriaRepositorio.save(categoria);
}

async remove(id: number) {
  const categoria = await this.findOne(id);
  await this.categoriaRepositorio.delete(categoria.id);
  return { deleted: true };
}
}
