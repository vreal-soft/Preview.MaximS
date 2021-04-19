import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string

  @IsString()
  @IsOptional()
  avatar_url?: string

  @ApiProperty({ enum: ['google', 'github'] })
  @IsEnum(['google', 'github'])
  login_provider: 'github' | 'google' = 'google'

  @IsString()
  temp_secret_2fa: string

  @IsBoolean()
  enabled_2fa: boolean
}