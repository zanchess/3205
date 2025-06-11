import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ShortUrlResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'shortUrl',
  })
  shortUrl: string;
}
