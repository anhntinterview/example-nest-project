import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  Observable,
  tap,
  map,
  catchError,
  throwError,
  of,
  TimeoutError,
  timeout
} from 'rxjs';


// EX2: handle data
export interface Respone<T> {
  data: T;
}

// EX1: trivial console.log
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before ...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After ... ${Date.now() - now}ms`))); // ex1: trivial console.log
  }
}

// EX2: handle data
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Respone<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Respone<T>> | Promise<Observable<Respone<T>>> {
    console.log('Before ...');
    return next.handle().pipe(map((data) => ({ data })));
  }
}

// EX3:
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? '' : value)));
  }
}

//EX4
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(() => new BadGatewayException())));
  }
}

//EX5
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]); // main code here
    }
    return next.handle();
  }
}

//EX6: Timeout
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
