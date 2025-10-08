import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './domain/entities/despesa.entity';
import { DespesaService } from './application/services/despesa.service';
import { DespesaController } from './presentation/http/despesa.controller';
import { Categoria } from '../categoria/domain/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa, Categoria])],
  controllers: [DespesaController],
  providers: [DespesaService],
})
export class DespesaModule {}
