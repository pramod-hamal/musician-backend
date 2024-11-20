import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationException } from './common/error/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        // console.log(errors);
        return new ValidationException(errors);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
