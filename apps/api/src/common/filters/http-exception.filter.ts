/**
 * HTTP Exception Filter
 * 
 * Global exception filter for handling HTTP exceptions.
 * Provides standardized error responses.
 * 
 * @module HttpExceptionFilter
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP Exception Filter
 * 
 * Catches all HTTP exceptions and formats them into a consistent response structure.
 * 
 * Flow:
 * 1. Catch exception
 * 2. Extract status code and message
 * 3. Log error details
 * 4. Return standardized error response
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message,
      details:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exceptionResponse
          : null,
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${errorResponse.error}`,
      exception.stack,
    );

    console.error('[HttpExceptionFilter] Error caught:', {
      status,
      path: request.url,
      method: request.method,
      error: errorResponse.error,
    });

    response.status(status).json(errorResponse);
  }
}
