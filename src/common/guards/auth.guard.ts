import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from 'auth/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authSerive: AuthService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler())
    if (noAuth) return false

    const req = context.switchToHttp().getRequest()

    let authorization = req.headers?.authorization
    let token
    if (authorization) {
      token = authorization.split(' ')[1]
    } else {
      authorization = req.handshake?.query?.auth_token

      if (!authorization) return
      token = authorization
    }

    const isJWT = await this.authSerive.isJWT(token)
    if (isJWT) {
      const user = await this.authSerive.validateByApiJwt(token)

      req.user = user

      if (!user.email) return false

      return true
    }

    return false
  }
}
