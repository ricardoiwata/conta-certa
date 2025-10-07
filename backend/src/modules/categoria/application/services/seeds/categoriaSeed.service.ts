import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../../domain/entities/categoria.entity';

@Injectable()
export class CategoriaSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async onModuleInit() {
    await this.seedCategorias();
  }

  private async seedCategorias() {
    const count = await this.categoriaRepository.count();

    if (count === 0) {
      const categorias = [
        { nomeCategoria: 'Alimentação' },
        { nomeCategoria: 'Transporte' },
        { nomeCategoria: 'Saúde' },
        { nomeCategoria: 'Educação' },
        { nomeCategoria: 'Lazer' },
        { nomeCategoria: 'Casa' },
        { nomeCategoria: 'Vestuário' },
        { nomeCategoria: 'Outros' },
      ];

      await this.categoriaRepository.save(categorias);
      console.log('Categorias criadas com sucesso!');
    }
  }
}
