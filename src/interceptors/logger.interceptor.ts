import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log('before');

    return next
  .handle()
  .pipe(
    map((resData) => {
      const { message = 'success', resData = {}, status = 200 } = data;
      return { message, data: resData, status };
    })
  ); 
  }
}