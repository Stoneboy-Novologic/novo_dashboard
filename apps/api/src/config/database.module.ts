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
        console.log('[DatabaseModule] Database name:', DB_CONFIG.DATABASE);
        
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
