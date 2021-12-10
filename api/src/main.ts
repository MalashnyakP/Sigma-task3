import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './appModule';
import { HttpExceptionFilter } from './httpExeptionHandler';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableVersioning({
        type: VersioningType.URI,
    });

    await app.listen(5000);
}
bootstrap();
