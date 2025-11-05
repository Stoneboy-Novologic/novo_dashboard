/**
 * Authentication Controller
 * 
 * Handles authentication endpoints (login, register, OAuth).
 * 
 * @module AuthController
 */

import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from '@construction-mgmt/shared/types';

/**
 * Authentication Controller
 * 
 * Provides endpoints for:
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login - User login
 * - POST /api/auth/refresh - Refresh access token
 * - GET /api/auth/google - Google OAuth initiation
 * - GET /api/auth/google/callback - Google OAuth callback
 * - GET /api/auth/microsoft - Microsoft OAuth initiation
 * - GET /api/auth/microsoft/callback - Microsoft OAuth callback
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log('[AuthController] Initializing authentication controller...');
  }

  /**
   * Register new user
   * POST /api/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    console.log('[AuthController] Registration request received');
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    console.log('[AuthController] Login request received');
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    console.log('[AuthController] Token refresh request received');
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Initiate Google OAuth
   * GET /api/auth/google
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('[AuthController] Google OAuth initiation');
    // Passport handles the redirect
  }

  /**
   * Google OAuth callback
   * GET /api/auth/google/callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req): Promise<AuthResponse> {
    console.log('[AuthController] Google OAuth callback received');
    // User is attached to request by Passport
    const tokens = await this.authService.generateTokens(req.user);
    return {
      ...tokens,
      user: this.authService.sanitizeUser(req.user),
    };
  }

  /**
   * Initiate Microsoft OAuth
   * GET /api/auth/microsoft
   */
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {
    console.log('[AuthController] Microsoft OAuth initiation');
    // Passport handles the redirect
  }

  /**
   * Microsoft OAuth callback
   * GET /api/auth/microsoft/callback
   */
  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthCallback(@Req() req): Promise<AuthResponse> {
    console.log('[AuthController] Microsoft OAuth callback received');
    // User is attached to request by Passport
    const tokens = await this.authService.generateTokens(req.user);
    return {
      ...tokens,
      user: this.authService.sanitizeUser(req.user),
    };
  }
}
