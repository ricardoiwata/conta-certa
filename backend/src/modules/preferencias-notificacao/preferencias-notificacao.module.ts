import { Module } from '@nestjs/common';
import { PreferenciasNotificacaoService } from './application/services/preferencias-notificacao.service';
import { PreferenciasNotificacaoController } from './presentation/http/preferencias-notificacao.controller';

@Module({
  controllers: [PreferenciasNotificacaoController],
  providers: [PreferenciasNotificacaoService],
})
export class PreferenciasNotificacaoModule {}
