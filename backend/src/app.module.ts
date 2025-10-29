import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesaModule } from './modules/despesa/despesa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitaModule } from './modules/receita/receita.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { PreferenciasNotificacaoModule } from './modules/preferencias-notificacao/preferencias-notificacao.module';
import { NotificacaoModule } from './notificacao/notificacao.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST ?? 'localhost', CONEXÃO PARA MYSQL
    //   port: Number(process.env.DB_PORT ?? 3306),
    //   username: process.env.DB_USER ?? 'root',
    //   password: process.env.DB_PASSWORD ?? '1234',
    //   database: process.env.DB_NAME ?? 'conta_certa',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   autoLoadEntities: true,
    //   synchronize: (process.env.DB_SYNC ?? 'true') === 'true',
    //   dropSchema: (process.env.DB_DROP_SCHEMA ?? 'false') === 'true',
    // }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DespesaModule,
    ReceitaModule,
    CategoriaModule,
    UsuarioModule,
    PreferenciasNotificacaoModule,
    NotificacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
