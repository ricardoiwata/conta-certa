import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receita } from '../receita/domain/entities/receita.entity';
import { Despesa } from '../despesa/domain/entities/despesa.entity';
import { Notificacao } from '../notificacao/domain/entities/notificacao.entity';
import { Usuario } from '../usuario/domain/entities/usuario.entity';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardController } from './presentation/http/dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receita, Despesa, Notificacao, Usuario]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
