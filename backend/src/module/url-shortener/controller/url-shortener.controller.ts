import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UrlShortenerService } from '../service/url-shortener.service';
import { CreateShortUrlDto } from '../dto/create-short-url.dto';
import { ShortUrlResponseDto } from '../dto/short-url-response.dto';
import { ShortUrlInfoResponseDto } from '../dto/short-url-info-response.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { DeleteShortUrlResponseDto } from '../dto/delete-short-url-response.dto';

@Controller('shorten')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  @ApiOperation({
    summary: 'Create short url',
  })
  @ApiBody({
    type: CreateShortUrlDto,
  })
  @ApiResponse({
    status: 200,
    type: ShortUrlResponseDto,
  })
  async createShortUrl(
    @Body() createShortUrlDto: CreateShortUrlDto,
  ): Promise<ShortUrlResponseDto> {
    const url =
      await this.urlShortenerService.createShortUrl(createShortUrlDto);
    return {
      shortUrl: `${process.env.HOST}:${process.env.PORT}/${url.alias}`,
    };
  }

  @Get('info/:shortUrl')
  @ApiOperation({
    summary: 'Get short url info',
  })
  @ApiResponse({
    status: 200,
    type: ShortUrlInfoResponseDto,
  })
  async getShortUrlInfo(
    @Param('shortUrl') shortUrl: string,
  ): Promise<ShortUrlInfoResponseDto> {
    const info = await this.urlShortenerService.getShortUrlInfo(shortUrl);
    return plainToInstance(ShortUrlInfoResponseDto, info, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('delete/:shortUrl')
  @ApiOperation({ summary: 'Delete short url' })
  @ApiResponse({
    status: 204,
    description: 'Short URL deleted',
    type: DeleteShortUrlResponseDto,
  })
  async deleteShortUrl(
    @Param('shortUrl') shortUrl: string,
  ): Promise<DeleteShortUrlResponseDto> {
    await this.urlShortenerService.deleteShortUrl(shortUrl);
    return {
      message: 'Short URL deleted',
    };
  }

  @Get('analytics/:shortUrl')
  @ApiOperation({ summary: 'Get analytics for short url' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        clickCount: 42,
        lastIps: ['192.168.1.1', '10.0.0.2', '8.8.8.8', '1.1.1.1', '127.0.0.1'],
      },
    },
  })
  async getAnalytics(
    @Param('shortUrl') shortUrl: string,
  ): Promise<{ clickCount: number; lastIps: string[] }> {
    return this.urlShortenerService.getAnalytics(shortUrl);
  }
}
