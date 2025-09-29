import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(4000);
    console.log('API listening on http://localhost:4000');
}
bootstrap();
//# sourceMappingURL=main.js.map