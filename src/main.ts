import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Cargos Salarios API')
    .setDescription('API for the Cargos Salarios project')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use('/api-docs', apiReference({ content: document, theme: 'elysiajs' }))

  app.setGlobalPrefix('/api')
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
