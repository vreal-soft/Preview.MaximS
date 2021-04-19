import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { QueryFailedError } from 'typeorm'

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger = new Logger('Exception filter')

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()

    this.logger.error(exception)

    switch (true) {
      case exception instanceof QueryFailedError:
        return res.status(400).json({
          statusCode: 400,
          message: exception.message,
        })
      default:
        super.catch(exception, host)
    }
  }
}
