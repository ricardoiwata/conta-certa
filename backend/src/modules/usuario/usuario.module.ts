import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './domain/entities/usuario.entity';
import { UsuarioService } from './application/services/usuario.service';
import { UsuarioController } from './presentation/http/usuario.controller';
import { UsuarioSeedService } from './application/services/seeds/usuarioSeed.service';
import { PreferenciasNotificacao } from '../preferencias-notificacao/domain/entities/preferencias-notificacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PreferenciasNotificacao])],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioSeedService],
})
export class UsuarioModule {}
