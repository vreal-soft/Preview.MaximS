import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import config from '../common/config'
import { JwtService } from '@nestjs/jwt'
import { google } from 'googleapis'
import * as _ from 'lodash'
import { createOAuthAppAuth } from '@octokit/auth-oauth-app'
import { Octokit } from '@octokit/rest'

import { UsersService } from 'users/users.service'

import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'
@Injectable()
export class AuthService {
  private readonly client = new google.auth.OAuth2(
    config.GOOGLE.client_id,
    config.GOOGLE.secret,
    'http://localhost:3000',
  )

  private readonly authClient = createOAuthAppAuth({
    clientId: config.GITHUB.client_id,
    clientSecret: config.GITHUB.client_secret,
  })

  private readonly githubClient = new Octokit()

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  private readonly userFields: string[] = [
    'id',
    'email',
    'first_name',
    'last_name',
    'avatar_url',
  ]

  private readonly githubUserFields: string[] = [
    'id',
    'email',
    'avatar_url',
    'name',
  ]

  async validateByApiJwt(token: string) {
    try {
      const user = this.jwtService.verify(token)
      if (!user) throw new ForbiddenException()
      return user
    } catch (error) {
      throw new ForbiddenException()
    }
  }

  async validate(email: string) {
    const user = await this.usersService.findOne({ email })

    if (!user)
      throw new UnauthorizedException(
        'No account with this email address currently exists',
      )

    if (!user.enabled_2fa)
      throw new ForbiddenException(
        '2-FA disabled, please, enable it in user settings',
      )

    return user
  }

  async isJWT(token: string) {
    return !!this.jwtService.decode(token)
  }

  getJWT(data: any) {
    return {
      user: data,
      access_token: this.jwtService.sign(data, {
        expiresIn: '2592000000s',
      }),
    }
  }

  async generateQR(code: string) {
    try {
      const otpauth_url = `otpauth://totp/SecretKey?secret=${code}`
      return await QRCode.toDataURL(otpauth_url)
    } catch (error) {
      console.error(error)
    }
  }

  async verifyAuthToken(token: string, email: string, encoding = 'base32') {
    const user = await this.usersService.findOne({ where: { email } })
    const verify = await speakeasy.totp.verify({
      secret: user.temp_secret_2fa,
      token,
      encoding,
    })

    if (!verify) throw new ForbiddenException('Verify code is wrong')

    if (!user.enabled_2fa) {
      user.enabled_2fa = true

      this.usersService.update({ where: { email } }, user)
    }

    return this.getJWT(
      _.pick(user, [
        'id',
        'email',
        'first_name',
        'last_name',
        'avatar_url',
        'enabled_2fa',
      ]),
    )
  }

  async googleLogin(tokenId: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: tokenId,
      audience: config.GOOGLE.client_id,
    })

    const payload = ticket.getPayload()

    let user = await this.usersService.findOne({
      where: { email: payload.email },
    })

    if (user) {
      user.first_name = payload.given_name
      user.last_name = payload.family_name
      user.avatar_url = payload.picture

      await this.usersService.update({ where: { id: user.id } }, user)
    } else {
      const secret = speakeasy.generateSecret()

      user = await this.usersService.create({
        first_name: payload.given_name,
        last_name: payload.family_name,
        email: payload.email,
        avatar_url: payload.picture,
        temp_secret_2fa: secret?.base32,
        login_provider: 'google',
        enabled_2fa: false,
      })
    }

    const data = {
      qrcode: !user.enabled_2fa
        ? await this.generateQR(user.temp_secret_2fa)
        : null,
      email: user.email,
    }

    return data
  }

  async getGithubUser(access_token) {
    const { data } = await this.githubClient.request('GET /user', {
      headers: {
        authorization: `token ${access_token}`,
      },
    })

    return _.pick(data, this.githubUserFields)
  }

  async githubLogin(code: string, redirectUrl: string) {
    const access_data = await this.authClient({
      code,
      redirectUrl,
      type: 'token',
    } as any)

    const payload = await this.getGithubUser((access_data as any).token)

    const [first_name, last_name] = payload.name.split(' ')

    let user = await this.usersService.findOne({
      where: { email: payload.email },
    })

    if (user) {
      user.first_name = first_name
      user.last_name = last_name
      user.avatar_url = payload.avatar_url

      this.usersService.update({ where: { id: user.id } }, user)
    } else {
      const secret = speakeasy.generateSecret()

      user = await this.usersService.create({
        first_name: first_name,
        last_name: last_name,
        email: payload.email,
        avatar_url: payload.avatar_url,
        temp_secret_2fa: secret?.base32,
        login_provider: 'github',
        enabled_2fa: false,
      })
    }

    const data = {
      qrcode: !user.enabled_2fa
        ? await this.generateQR(user.temp_secret_2fa)
        : null,
      email: user.email,
    }

    return data
  }
}
