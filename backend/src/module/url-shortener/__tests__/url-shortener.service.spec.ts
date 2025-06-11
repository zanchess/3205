import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from '../service/url-shortener.service';
import { UrlShortenerRepository } from '../repository/url-shortener.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  findByAlias: jest.fn(),
  createShortUrl: jest.fn(),
});

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let repository: ReturnType<typeof mockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        { provide: UrlShortenerRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    repository = module.get(UrlShortenerRepository);
  });

  describe('createShortUrl', () => {
    it('should create a short url with unique alias', async () => {
      repository.findByAlias.mockResolvedValue(null);
      repository.createShortUrl.mockResolvedValue({
        id: 1,
        alias: 'unique',
        originalUrl: 'https://test.com',
        expiresAt: new Date(),
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const dto = { originalUrl: 'https://test.com', alias: 'unique' };
      const result = await service.createShortUrl(dto as any);
      expect(result.alias).toBe('unique');
      expect(repository.createShortUrl).toHaveBeenCalledWith(
        expect.objectContaining({ alias: 'unique' }),
      );
    });

    it('should throw if alias already exists', async () => {
      repository.findByAlias.mockResolvedValue({ id: 1 });
      const dto = { originalUrl: 'https://test.com', alias: 'unique' };
      await expect(service.createShortUrl(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getShortUrlInfo', () => {
    it('should return url info for valid alias', async () => {
      const now = new Date();
      repository.findByAlias.mockResolvedValue({
        id: 1,
        alias: 'unique',
        originalUrl: 'https://test.com',
        expiresAt: new Date(now.getTime() + 100000),
        clickCount: 0,
        createdAt: now,
        updatedAt: now,
      });
      const result = await service.getShortUrlInfo('unique');
      expect(result.originalUrl).toBe('https://test.com');
    });

    it('should throw if alias not found', async () => {
      repository.findByAlias.mockResolvedValue(null);
      await expect(service.getShortUrlInfo('notfound')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if url is expired', async () => {
      repository.findByAlias.mockResolvedValue({
        id: 1,
        alias: 'unique',
        originalUrl: 'https://test.com',
        expiresAt: new Date(Date.now() - 100000),
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await expect(service.getShortUrlInfo('unique')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
