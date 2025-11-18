import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from '../receita/domain/entities/receita.entity';
import { Despesa } from '../despesa/domain/entities/despesa.entity';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardController } from './presentation/http/dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receita, Despesa]), AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
