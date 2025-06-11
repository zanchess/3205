import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlShortenerRepository } from '../repository/url-shortener.repository';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { Url } from '@prisma/client';

@Injectable()
export class UrlShortenerService {
  constructor(
    private readonly urlShortenerRepository: UrlShortenerRepository,
  ) {}

  async createShortUrl(createShortUrl: CreateShortUrlDto): Promise<Url> {
    const { alias } = createShortUrl;
    if (alias) {
      const url = await this.urlShortenerRepository.findByAlias(alias);
      if (url) {
        throw new BadRequestException('Alias already exists');
      }
    }

    return await this.urlShortenerRepository.createShortUrl({
      ...createShortUrl,
      alias: alias?.trim() || this.generateRandomAlias(),
    });
  }

  async getShortUrlInfo(shortUrl: string): Promise<Url> {
    const alias = shortUrl.split('/').pop();
    if (!alias) {
      throw new NotFoundException('Alias not found in shortUrl');
    }
    const url = await this.urlShortenerRepository.findByAlias(alias);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('Short URL is expired');
    }

    return url;
  }

  @Transactional()
  async deleteShortUrl(shortUrl: string): Promise<void> {
    const alias = shortUrl.split('/').pop();
    if (!alias) {
      throw new NotFoundException('Alias not found in shortUrl');
    }
    const url = await this.urlShortenerRepository.findByAlias(alias);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    await this.urlShortenerRepository.deleteVisitData(alias);
    await this.urlShortenerRepository.deleteByAlias(alias);
  }

  async getAnalytics(
    shortUrl: string,
  ): Promise<{ clickCount: number; lastIps: string[] }> {
    const alias = shortUrl.split('/').pop();
    if (!alias) {
      throw new NotFoundException('Alias not found in shortUrl');
    }
    const url = await this.urlShortenerRepository.findByAlias(alias);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    const lastVisits = await this.urlShortenerRepository.getLastVisits(
      url.id,
      5,
    );
    return {
      clickCount: url.clickCount,
      lastIps: lastVisits.map((v) => v.ip),
    };
  }

  @Transactional()
  async saveVisit(urlId: number, ip: string): Promise<void> {
    await this.urlShortenerRepository.updateShortUrl(urlId);
    await this.urlShortenerRepository.saveVisit(urlId, ip);
  }

  private generateRandomAlias(length = 8): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
