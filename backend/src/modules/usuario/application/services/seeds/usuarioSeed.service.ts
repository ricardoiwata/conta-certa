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
        { nome: 'Ricardo Iwata', email: 'ricardo@gmail.com' },
        { nome: 'Marcos Frota', email: 'marcos@gmail.com' },
        { nome: 'Paulo Victor', email: 'paulo@gmail.com' },
        { nome: 'Nicolas Medeiros', email: 'nicolas@gmail.com' },
        { nome: 'João Fernando', email: 'joaoF@gmail.com' },
        { nome: 'Matheus Dutra', email: 'matheus@gmail.com' },
      ];

      await this.usuarioRepositorio.save(usuarios);
      console.log('Users criados com sucesso!');
    }
  }
}
