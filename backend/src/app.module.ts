import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ClsModule } from 'nestjs-cls';
import { UrlShortenerModule } from './module/url-shortener/url-shortener.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: DatabaseService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
    UrlShortenerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
