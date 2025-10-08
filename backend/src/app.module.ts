import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesaModule } from './modules/despesa/despesa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitaModule } from './modules/receita/receita.module';
import { CategoriaModule } from './modules/categoria/categoria.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '1234',
      database: process.env.DB_NAME ?? 'conta_certa',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: (process.env.DB_SYNC ?? 'true') === 'true',
      dropSchema: (process.env.DB_DROP_SCHEMA ?? 'false') === 'true',
    }),
    DespesaModule,
    ReceitaModule,
    CategoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
