import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ShortUrlInfoResponseDto {
  @Expose()
  @ApiProperty({ example: 'https://example.com' })
  originalUrl: string;

  @Expose()
  @ApiProperty({ example: '2024-06-10T15:42:07.493Z', type: String })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: 0 })
  clickCount: number;
}
