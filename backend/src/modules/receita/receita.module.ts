import { Module } from '@nestjs/common';
import { ReceitaService } from './application/services/receita.service';
import { ReceitaController } from './presentation/http/receita.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from './domain/entities/receita.entity';
import { ReceitaSeedService } from './application/services/seeds/receitaSeed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receita]), AuthModule],
  controllers: [ReceitaController],
  providers: [ReceitaService, ReceitaSeedService],
})
export class ReceitaModule {}
