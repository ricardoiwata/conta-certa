import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Despesa } from '../../../domain/entities/despesa.entity';
import { Categoria } from 'src/modules/categoria/domain/entities/categoria.entity';

@Injectable()
export class DespesaSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Despesa)
    private despesaRepository: Repository<Despesa>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async onModuleInit() {
    await this.seedDespesas();
  }

  private async seedDespesas() {
    const count = await this.despesaRepository.count();

    if (count === 0) {
      const testUserUid = 'test-user-001';
      const alimentacao = await this.categoriaRepository.findOne({
        where: { nomeCategoria: 'Alimentação' },
      });

      if (alimentacao) {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const despesas = [
          {
            descricao: 'Compras no supermercado',
            valor: 150.50,
            data: today,
            formaPagamento: 'Débito' as const,
            recorrentePai: false,
            realizada: true,
            usuarioUid: testUserUid,
            categoriaId: alimentacao.id,
          },
          {
            descricao: 'Almoço no restaurante',
            valor: 45.00,
            data: today,
            formaPagamento: 'Crédito' as const,
            recorrentePai: false,
            realizada: true,
            usuarioUid: testUserUid,
            categoriaId: alimentacao.id,
          },
          {
            descricao: 'Café da manhã',
            valor: 25.00,
            data: tomorrow,
            formaPagamento: 'Dinheiro' as const,
            recorrentePai: false,
            realizada: false,
            usuarioUid: testUserUid,
            categoriaId: alimentacao.id,
          },
        ];

        await this.despesaRepository.save(despesas);
        console.log('Despesas de teste criadas com sucesso!');
      }
    }
  }
}
