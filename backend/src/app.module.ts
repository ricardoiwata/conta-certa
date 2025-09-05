import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesaModule } from './modules/despesa/despesa.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [DespesaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
