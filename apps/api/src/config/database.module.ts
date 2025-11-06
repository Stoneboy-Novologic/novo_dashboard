/**
 * Database Configuration Module
 * 
 * Configures TypeORM connection to PostgreSQL database.
 * 
 * @module DatabaseModule
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_CONFIG } from '@construction-mgmt/shared/config';

/**
 * Database Configuration Module
 * 
 * Sets up TypeORM connection to PostgreSQL with environment-based configuration.
 * 
 * Database Connection Flow:
 * 1. Load environment variables
 * 2. Configure TypeORM connection
 * 3. Register entities (to be added)
 * 4. Set up migrations (to be added)
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('[DatabaseModule] Configuring TypeORM connection...');
        console.log('[DatabaseModule] Database host:', DB_CONFIG.HOST);
        console.log('[DatabaseModule] Database port:', DB_CONFIG.PORT);
        console.log('[DatabaseModule] Database name:', DB_CONFIG.DATABASE);
        console.log('[DatabaseModule] Database user:', DB_CONFIG.USERNAME);
        
        return {
          type: 'postgres',
          host: DB_CONFIG.HOST,
          port: DB_CONFIG.PORT,
          username: DB_CONFIG.USERNAME,
          password: DB_CONFIG.PASSWORD,
          database: DB_CONFIG.DATABASE,
          entities: [
            __dirname + '/../entities/**/*.entity{.ts,.js}',
          ],
          synchronize: DB_CONFIG.SYNCHRONIZE, // Only true in development
          logging: DB_CONFIG.LOGGING,
          // Docker-compatible connection settings
          // Retry connection logic for Docker (database might take time to start)
          connectTimeoutMS: 60000, // 60 seconds connection timeout
          retryAttempts: 5, // Retry connection attempts
          retryDelay: 3000, // 3 seconds between retries
          // Connection pool settings for Docker/production
          extra: {
            max: 10, // Maximum number of connections in pool
            min: 2, // Minimum number of connections in pool
            idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
          },
          // migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
          // migrationsRun: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  constructor() {
    console.log('[DatabaseModule] Database module initialized');
  }
}
