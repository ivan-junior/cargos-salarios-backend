import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { auth } from './db/better-auth'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  })
  app.setGlobalPrefix('/api')

  const authOpenApiSchema = await auth.api.generateOpenAPISchema()
  authOpenApiSchema.info.title = 'Cargos & Salarios API'
  authOpenApiSchema.info.description = 'API for the Cargos & Salarios project'
  authOpenApiSchema.info.version = '1.0'

  const prefixedAuthPaths = {}
  for (const path in authOpenApiSchema.paths) {
    if (Object.prototype.hasOwnProperty.call(authOpenApiSchema.paths, path)) {
      prefixedAuthPaths[`/api/auth${path}`] = authOpenApiSchema.paths[path]
    }
  }

  const config = new DocumentBuilder()
    .setTitle('Cargos & Salarios API')
    .setDescription('API for the Cargos & Salarios project')
    .setVersion('1.0')
    .setBasePath('/api')
    .build()

  const appDocument = SwaggerModule.createDocument(app, config)

  const combinedDocument = {
    ...appDocument,
    paths: { ...appDocument.paths, ...prefixedAuthPaths },
    components: {
      ...appDocument.components,
      ...authOpenApiSchema.components,
      schemas: {
        ...appDocument.components?.schemas,
        ...authOpenApiSchema.components?.schemas
      }
    }
  }

  app.use(
    '/api-docs',
    apiReference({
      content: combinedDocument,
      theme: 'elysiajs',
      pageTitle: 'Cargos & Salarios API - Documentação'
    })
  )

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
