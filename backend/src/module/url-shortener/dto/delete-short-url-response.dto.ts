import { ApiProperty } from '@nestjs/swagger';

export class DeleteShortUrlResponseDto {
  @ApiProperty({
    type: String,
    example: 'Short URL deleted',
  })
  message: string;
}
