import { Module } from '@nestjs/common';
import { UsuarioService } from './application/services/usuario.service';
import { UsuarioController } from './presentation/http/usuario.controller';
import { USUARIO_REPOSITORY } from './domain/repositories/tokens';
import { InMemoryUsuarioRepository } from './infrastructure/persistence/in-memory/usuario.repository.memory';

@Module({
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    { provide: USUARIO_REPOSITORY, useClass: InMemoryUsuarioRepository },
  ],
  exports: [],
})
export class UsuarioModule {}
