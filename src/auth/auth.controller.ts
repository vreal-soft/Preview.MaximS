import {
  Controller,
  BadRequestException,
  Get,
  Req,
  Query,
  Body,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { GithubDto, GoogleDto } from './dto/index'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSerive: AuthService) {}

  @Get('google')
  async googleLogin(@Req() req, @Query() { tokenId }: GoogleDto): Promise<any> {
    if (!tokenId) throw new BadRequestException('No TokenId has been provided!')
    return await this.authSerive.googleLogin(tokenId)
  }

  @Get('github')
  async githubLogin(@Body() body, @Query() { code, redirect_url }: GithubDto) {
    console.log('redirect_url', redirect_url)
    return await this.authSerive.githubLogin(code, redirect_url)
  }

  @Get('login')
  async verify(@Query() { token, email }) {
    return await this.authSerive.verifyAuthToken(token, email)
  }
}
