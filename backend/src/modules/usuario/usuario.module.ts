import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './domain/entities/usuario.entity';
import { UsuarioService } from './application/services/usuario.service';
import { UsuarioController } from './presentation/http/usuario.controller';
import { UsuarioSeedService } from './application/services/seeds/usuarioSeed.service';
import { PreferenciasNotificacao } from '../preferencias-notificacao/domain/entities/preferencias-notificacao.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, PreferenciasNotificacao]), AuthModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioSeedService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
