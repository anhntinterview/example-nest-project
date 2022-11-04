import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { RoleGuard } from './common/guard/roles.guard';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { logger } from './common/logger/logger.middleware';
// Lưu ý rằng: ValidationPipe được build chỉ để lấy ví dụ. Nó đã có sẵn trong Nest
// import { ValidationPipe } from '../common/pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // *** Apply Global Middleware. ---> not DI cause registed outside module
  // At the current, GET method will be logged 2 times,
  // And DELETE will be 1 time cause it was excluded in app.module.ts
  // app.use(logger)

  // *** Apply Global Filter ---> not DI cause registed outside module
  // app.useGlobalFilters(new HttpExceptionFilter)
  // *** Using catch all exception for global
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // *** Apply Validation Pipe ---> not DI cause registed outside module
  // app.useGlobalPipes(new ValidationPipe());

  // *** Apply Guard ---> not DI cause registed outside module
  // app.useGlobalGuards(new RoleGuard());

  // *** Apply Interceptor ---> not DI cause registed outside module
  // app.useGlobalInterceptors(new LoggingInterceptor())
  app.enableCors({
    origin: ["http://localhost:8080","http://localhost:3001","http://localhost:3002","http://localhost:3006"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
