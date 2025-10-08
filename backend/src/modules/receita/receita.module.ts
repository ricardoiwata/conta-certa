import { Module } from '@nestjs/common';
import { ReceitaService } from './application/services/receita.service';
import { ReceitaController } from './presentation/http/receita.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from './domain/entities/receita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receita])],
  controllers: [ReceitaController],
  providers: [ReceitaService],
})
export class ReceitaModule {}
