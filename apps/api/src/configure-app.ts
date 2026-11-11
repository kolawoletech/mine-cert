import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const documentConfig = new DocumentBuilder()
    .setTitle('MineCert API')
    .setDescription('MineCert platform REST API')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });
}
