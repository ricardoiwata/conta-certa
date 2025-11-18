import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './domain/entities/despesa.entity';
import { DespesaService } from './application/services/despesa.service';
import { DespesaController } from './presentation/http/despesa.controller';
import { Categoria } from '../categoria/domain/entities/categoria.entity';
import { Usuario } from '../usuario/domain/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa, Categoria, Usuario])],
  controllers: [DespesaController],
  providers: [DespesaService],
})
export class DespesaModule {}
