import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { UrlShortenerService } from '../service/url-shortener.service';
import { Response, Request } from 'express';

@Controller()
export class UrlRedirectController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get(':alias')
  async redirectToOriginal(
    @Param('alias') alias: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const url = await this.urlShortenerService.getShortUrlInfo(alias);
    await this.urlShortenerService.saveVisit(url.id, req.ip || '127.0.0.1');
    return res.redirect(url.originalUrl);
  }
}
