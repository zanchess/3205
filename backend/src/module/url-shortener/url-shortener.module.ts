import { Module } from '@nestjs/common';
import { UrlShortenerController } from './controller/url-shortener.controller';
import { UrlShortenerService } from './service/url-shortener.service';
import { UrlShortenerRepository } from './repository/url-shortener.repository';
import { DatabaseModule } from '../../database/database.module';
import { UrlRedirectController } from './controller/url-redirect.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UrlShortenerController, UrlRedirectController],
  providers: [UrlShortenerService, UrlShortenerRepository],
})
export class UrlShortenerModule {}
