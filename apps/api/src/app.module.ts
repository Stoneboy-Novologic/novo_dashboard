/**
 * Root Application Module
 * 
 * This is the root module of the NestJS application.
 * It imports all feature modules and configuration modules.
 * 
 * @module AppModule
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Root Application Module
 * 
 * This module serves as the entry point for the entire application.
 * All feature modules should be imported here.
 * 
 * Module Structure:
 * - ConfigModule: Environment configuration
 * - TypeOrmModule: Database connection
 * - Feature Modules: Auth, Projects, Tasks, etc. (to be added)
 */
@Module({
  imports: [
    // Configuration module - Loads environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make config available throughout the app
      envFilePath: ['.env.local', '.env'],
    }),
    // Database module - TypeORM configuration
    DatabaseModule,
    // Authentication module
    AuthModule,
    // Projects module
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('[AppModule] Initializing root application module...');
  }
}
