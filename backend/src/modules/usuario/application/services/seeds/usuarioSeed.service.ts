import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/entities/usuario.entity';

@Injectable()
export class UsuarioSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    await this.seedUsuarios();
  }

  private async seedUsuarios() {
    const count = await this.usuarioRepositorio.count();

    if (count === 0) {
      const usuarios = [
        { nome: 'João Victor', email: 'joao@gmail.com' },
        // { nome: 'Ricardo Iwata' },
        // { nome: 'Marcos Frota' },
        // { nome: 'Paulo Victor' },
        // { nome: 'Nicolas Medeiros' },
        // { nome: 'João Fernando' },
        // { nome: 'Matheus Dutra' },
      ];

      await this.usuarioRepositorio.save(usuarios);
      console.log('Users criados com sucesso!');
    }
  }
}
