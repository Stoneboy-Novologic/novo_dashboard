/**
 * Logging Interceptor
 * 
 * Intercepts requests and responses for logging purposes.
 * 
 * @module LoggingInterceptor
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging Interceptor
 * 
 * Logs all incoming requests and outgoing responses.
 * Useful for debugging and monitoring.
 * 
 * Flow:
 * 1. Log incoming request
 * 2. Execute handler
 * 3. Log outgoing response
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    console.log('[LoggingInterceptor] Incoming request:', {
      method,
      url,
      body: body && Object.keys(body).length > 0 ? body : undefined,
      query: query && Object.keys(query).length > 0 ? query : undefined,
      params: params && Object.keys(params).length > 0 ? params : undefined,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          console.log('[LoggingInterceptor] Response sent:', {
            method,
            url,
            statusCode: context.switchToHttp().getResponse().statusCode,
            responseTime: `${responseTime}ms`,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          console.error('[LoggingInterceptor] Request failed:', {
            method,
            url,
            error: error.message,
            responseTime: `${responseTime}ms`,
          });
        },
      }),
    );
  }
}
