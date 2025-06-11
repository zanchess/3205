import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortUrlDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  originalUrl: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: Date,
    required: false,
  })
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    type: String,
    required: false,
  })
  alias?: string;
}
