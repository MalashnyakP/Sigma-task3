import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './appModule';
import { HttpExceptionFilter } from './httpExeptionHandler';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableVersioning({
        type: VersioningType.URI,
    });

    const options = new DocumentBuilder()
        .setTitle('Movies API')
        .setDescription('Korean movies API')
        .setVersion('1')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  
    await app.listen(5000);
}
bootstrap();
