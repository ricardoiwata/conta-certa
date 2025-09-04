import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesaModule } from './despesa/despesa.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DespesaModule } from './despesa/despesa.module';

@Module({
  imports: [DespesaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
