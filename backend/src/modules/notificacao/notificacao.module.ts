import { Module } from '@nestjs/common';
import { NotificacaoService } from './application/services/notificacao.service';
import { NotificacaoController } from './presentation/http/notificacao.controller';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import { Notificacao } from './domain/entities/notificacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Notificacao])],
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
})
export class NotificacaoModule {}
