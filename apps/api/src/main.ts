/**
 * NestJS Application Entry Point
 * 
 * This is the main entry point for the NestJS backend API.
 * It initializes the application, sets up middleware, and starts the server.
 * 
 * @module main
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Bootstrap function to start the NestJS application
 * 
 * This function:
 * 1. Creates the NestJS application instance
 * 2. Sets up global middleware (CORS, Helmet, Validation)
 * 3. Starts the HTTP server
 * 
 * Flow:
 * main() -> NestFactory.create() -> app setup -> app.listen()
 */
async function bootstrap() {
  console.log('[main] Starting NestJS application...');
  
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Security middleware - Helmet helps secure Express apps by setting various HTTP headers
  console.log('[main] Setting up security middleware (Helmet)...');
  app.use(helmet());

  // Enable CORS - Configure based on your frontend URL
  // Docker-compatible: Supports multiple origins (comma-separated) and Docker network scenarios
  console.log('[main] Configuring CORS...');
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || ['http://localhost:3000'];
  console.log('[main] CORS origins:', corsOrigins);
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        callback(null, true);
      } else {
        // In development, allow localhost variants
        if (process.env.NODE_ENV !== 'production' && 
            (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Global validation pipe - Automatically validates all incoming requests
  console.log('[main] Setting up global validation pipe...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    })
  );

  // Global prefix for all routes
  console.log('[main] Setting global API prefix...');
  app.setGlobalPrefix('api');

  // Global exception filters
  console.log('[main] Setting up global exception filters...');
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Global interceptors
  console.log('[main] Setting up global interceptors...');
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Start server
  console.log('[main] Starting HTTP server on port:', port);
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log('[main] Application successfully started');
}

// Start the application
bootstrap().catch((error) => {
  console.error('[main] Failed to start application:', error);
  process.exit(1);
});
