import { Module } from '@nestjs/common';
import { CategoriaService } from './application/services/categoria.service';
import { CategoriaController } from './presentation/http/categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './domain/entities/categoria.entity';
import { CategoriaSeedService } from './application/services/seeds/categoriaSeed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaSeedService],
})
export class CategoriaModule {}
