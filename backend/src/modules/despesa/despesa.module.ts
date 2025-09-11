import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesa } from './domain/entities/despesa.entity';
import { DespesaService } from './application/services/despesa.service';
import { DespesaController } from './presentation/http/despesa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa])],
  controllers: [DespesaController],
  providers: [DespesaService],
})
export class DespesaModule {}
