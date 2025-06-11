import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { Url } from '../interfaces/url-shortener.interface';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class UrlShortenerRepository {
  constructor(
    private readonly thHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async createShortUrl(
    createShortUrlDto: Omit<CreateShortUrlDto, 'alias'> & { alias: string },
  ): Promise<Url> {
    const { originalUrl, expiresAt, alias } = createShortUrlDto;
    return this.thHost.tx.url.create({
      data: {
        originalUrl,
        expiresAt: expiresAt
          ? new Date(expiresAt)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        alias,
      },
    });
  }

  async findByAlias(alias: string): Promise<Url | null> {
    return this.thHost.tx.url.findUnique({ where: { alias } });
  }

  async deleteByAlias(alias: string): Promise<void> {
    await this.thHost.tx.url.delete({ where: { alias } });
  }

  async deleteVisitData(alias: string): Promise<void> {
    await this.thHost.tx.urlVisit.deleteMany({ where: { url: { alias } } });
  }

  async getLastVisits(
    urlId: number,
    limit: number,
  ): Promise<{ ip: string; visitedAt: Date }[]> {
    return this.thHost.tx.urlVisit.findMany({
      where: { urlId },
      orderBy: { visitedAt: 'desc' },
      distinct: ['ip'],
      take: limit,
      select: { ip: true, visitedAt: true },
    });
  }

  async updateShortUrl(urlId: number) {
    return this.thHost.tx.url.update({
      where: { id: urlId },
      data: {
        clickCount: { increment: 1 },
      },
    });
  }

  async saveVisit(urlId: number, ip: string): Promise<void> {
    await this.thHost.tx.urlVisit.create({
      data: {
        urlId,
        ip,
      },
    });
  }
}
