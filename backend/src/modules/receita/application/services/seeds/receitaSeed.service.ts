import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receita } from '../../../domain/entities/receita.entity';

@Injectable()
export class ReceitaSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Receita)
    private receitaRepository: Repository<Receita>,
  ) {}

  async onModuleInit() {
    await this.seedReceitas();
  }

  private async seedReceitas() {
    const count = await this.receitaRepository.count();

    if (count === 0) {
      const testUserUid = 'test-user-001';
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const receitas = [
        {
          descricao: 'Salário',
          valor: 3000.00,
          data: today,
          dataCompetencia: today,
          origem: 'Fixo' as const,
          recorrentePai: false,
          realizada: true,
          usuarioUid: testUserUid,
        },
        {
          descricao: 'Freelance',
          valor: 500.00,
          data: today,
          dataCompetencia: today,
          origem: 'Variável' as const,
          recorrentePai: false,
          realizada: true,
          usuarioUid: testUserUid,
        },
        {
          descricao: 'Bônus esperado',
          valor: 800.00,
          data: tomorrow,
          dataCompetencia: tomorrow,
          origem: 'Variável' as const,
          recorrentePai: false,
          realizada: false,
          usuarioUid: testUserUid,
        },
      ];

      await this.receitaRepository.save(receitas);
      console.log('Receitas de teste criadas com sucesso!');
    }
  }
}
