import { Module } from '@nestjs/common';
import { DespesaService } from './application/services/despesa.service';
import { DespesaController } from './presentation/http/despesa.controller';
import { DESPESA_REPOSITORY } from './domain/repositories/tokens';
import { InMemoryDespesaRepository } from './infrastructure/persistence/in-memory/despesa.repository.memory';

@Module({
  controllers: [DespesaController],
  providers: [
    DespesaService,
    { provide: DESPESA_REPOSITORY, useClass: InMemoryDespesaRepository },
  ],
  exports: [],
})
export class DespesaModule {}
