// 1st
// ***** STANDARD WAY WHICH CAN HANDLE CUSTOMIZE BUSINESS

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responeBody = {
      statusCode: HttpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responeBody, httStatus);
  }
}

// 2nd
// ***** SHELL DEMONSTRATING APPROACH

// import {
//   ArgumentsHost,
//   Catch,
// } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';

// @Catch()
// export class AllExceptionsFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost): void {
//     super.catch(exception, host)
//   }
// }
