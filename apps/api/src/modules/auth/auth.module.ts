/**
 * Authentication Module
 * 
 * Module for handling user authentication and authorization.
 * 
 * @module AuthModule
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { User } from '../../entities/user.entity';
import { AUTH_CONFIG } from '@construction-mgmt/shared/config';

/**
 * Authentication Module
 * 
 * Provides:
 * - JWT authentication
 * - Google OAuth authentication
 * - Microsoft OAuth authentication
 * - User registration and login
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AUTH_CONFIG.JWT_SECRET,
      signOptions: {
        expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, MicrosoftStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {
  constructor() {
    console.log('[AuthModule] Authentication module initialized');
  }
}
