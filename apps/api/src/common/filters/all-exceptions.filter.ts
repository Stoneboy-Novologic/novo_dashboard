/**
 * All Exceptions Filter
 * 
 * Global exception filter for handling all exceptions (not just HTTP exceptions).
 * Catches unexpected errors and provides standardized error responses.
 * 
 * @module AllExceptionsFilter
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * All Exceptions Filter
 * 
 * Catches all exceptions (including non-HTTP exceptions) and formats them.
 * This is a fallback for unexpected errors.
 * 
 * Flow:
 * 1. Catch any exception
 * 2. Log error with stack trace
 * 3. Return standardized 500 error response
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof Error && 'status' in exception
        ? (exception as any).status
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error with full stack trace
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    console.error('[AllExceptionsFilter] Unexpected error caught:', {
      status,
      path: request.url,
      method: request.method,
      error: message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
