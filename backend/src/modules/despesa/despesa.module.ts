import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './domain/entities/despesa.entity';
import { DespesaService } from './application/services/despesa.service';
import { DespesaController } from './presentation/http/despesa.controller';
import { Categoria } from '../categoria/domain/entities/categoria.entity';
import { DespesaSeedService } from './application/services/seeds/despesaSeed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa, Categoria]), AuthModule],
  controllers: [DespesaController],
  providers: [DespesaService, DespesaSeedService],
})
export class DespesaModule {}
