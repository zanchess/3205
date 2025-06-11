import { Test, TestingModule } from '@nestjs/testing';
import { UrlRedirectController } from '../controller/url-redirect.controller';
import { UrlShortenerService } from '../service/url-shortener.service';
import { NotFoundException } from '@nestjs/common';

const mockService = () => ({
  getShortUrlInfo: jest.fn(),
  saveVisit: jest.fn(),
});

describe('UrlRedirectController', () => {
  let controller: UrlRedirectController;
  let service: ReturnType<typeof mockService>;
  let res: any;
  let req: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlRedirectController],
      providers: [{ provide: UrlShortenerService, useFactory: mockService }],
    }).compile();

    controller = module.get<UrlRedirectController>(UrlRedirectController);
    service = module.get(UrlShortenerService);
    res = { redirect: jest.fn() };
    req = { ip: '1.2.3.4' };
  });

  it('should redirect to original url', async () => {
    service.getShortUrlInfo.mockResolvedValue({
      id: 1,
      originalUrl: 'https://test.com',
    });
    await controller.redirectToOriginal('alias', res, req);
    expect(service.getShortUrlInfo).toHaveBeenCalledWith('alias');
    expect(service.saveVisit).toHaveBeenCalledWith(1, '1.2.3.4');
    expect(res.redirect).toHaveBeenCalledWith('https://test.com');
  });

  it('should throw NotFoundException if url not found', async () => {
    service.getShortUrlInfo.mockRejectedValue(new NotFoundException());
    await expect(
      controller.redirectToOriginal('bad', res, req),
    ).rejects.toThrow(NotFoundException);
  });
});
