import { NestFactory, HttpAdapterHost } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ExceptionsFilter } from './common/filters/http-exeption.filter'
import { AppLogger } from './common/utils/logger'
import config from './common/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  })

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const options = new DocumentBuilder()
    .addBearerAuth()
    .addBasicAuth({
      type: 'http',
      description: 'Use api_key and api_secret',
    })
    .setTitle('Lead Line OPS')
    .setDescription('Lead Line OPS API documentation')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter))

  await app.listen(config.PORT)
}
bootstrap()
