/**
 * Authentication Service
 * 
 * Handles authentication logic including login, registration, and token management.
 * 
 * @module AuthService
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, UserRole } from '@construction-mgmt/shared/types';
import { AUTH_CONFIG } from '@construction-mgmt/shared/config';

/**
 * Authentication Service
 * 
 * Provides methods for user authentication and authorization.
 * 
 * Service Flow:
 * 1. Login: Validate credentials -> Generate JWT tokens -> Return auth response
 * 2. Register: Hash password -> Create user -> Generate tokens -> Return auth response
 * 3. OAuth: Find or create user -> Generate tokens -> Return auth response
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    console.log('[AuthService] Initializing authentication service...');
  }

  /**
   * Register a new user
   * 
   * @param registerDto - Registration data
   * @returns Authentication response with tokens and user data
   * @throws ConflictException if email already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    console.log('[AuthService] Registering new user:', registerDto.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      console.log('[AuthService] Registration failed: Email already exists');
      throw new ConflictException('Email already registered');
    }

    // Hash password
    console.log('[AuthService] Hashing password...');
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: hashedPassword,
      role: UserRole.VIEWER, // Default role
    });

    const savedUser = await this.userRepository.save(user);
    console.log('[AuthService] User created successfully:', savedUser.id);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      ...tokens,
      user: this.sanitizeUser(savedUser),
    };
  }

  /**
   * Login user with email and password
   * 
   * @param loginDto - Login credentials
   * @returns Authentication response with tokens and user data
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    console.log('[AuthService] Attempting login for:', loginDto.email);

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      console.log('[AuthService] Login failed: User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('[AuthService] Login failed: User account is inactive');
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    if (!user.password) {
      console.log('[AuthService] Login failed: User has no password (OAuth only)');
      throw new UnauthorizedException('Please use OAuth to login');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      console.log('[AuthService] Login failed: Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('[AuthService] Login successful for user:', user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Validate user by ID (used by JWT strategy)
   * 
   * @param userId - User ID
   * @returns User entity or null
   */
  async validateUser(userId: string): Promise<User | null> {
    console.log('[AuthService] Validating user:', userId);
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
    
    if (!user) {
      console.log('[AuthService] User validation failed: User not found or inactive');
      return null;
    }

    console.log('[AuthService] User validated successfully');
    return user;
  }

  /**
   * Find or create user from OAuth profile
   * 
   * @param profile - OAuth profile data
   * @param provider - OAuth provider name ('google' or 'microsoft')
   * @returns User entity
   */
  async findOrCreateOAuthUser(profile: any, provider: 'google' | 'microsoft'): Promise<User> {
    console.log('[AuthService] Finding or creating OAuth user:', profile.email, 'provider:', provider);

    const providerIdField = provider === 'google' ? 'googleId' : 'microsoftId';
    const providerId = profile.id || profile.sub;

    // Try to find user by provider ID
    let user = await this.userRepository.findOne({
      where: { [providerIdField]: providerId },
    });

    if (user) {
      console.log('[AuthService] Found existing OAuth user');
      return user;
    }

    // Try to find user by email
    user = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (user) {
      // Link OAuth account to existing user
      console.log('[AuthService] Linking OAuth account to existing user');
      user[providerIdField] = providerId;
      if (profile.picture) {
        user.avatar = profile.picture;
      }
      return await this.userRepository.save(user);
    }

    // Create new user
    console.log('[AuthService] Creating new OAuth user');
    user = this.userRepository.create({
      email: profile.email,
      firstName: profile.given_name || profile.firstName || '',
      lastName: profile.family_name || profile.lastName || '',
      [providerIdField]: providerId,
      avatar: profile.picture || profile.photo || null,
      role: UserRole.VIEWER,
      password: null, // OAuth users don't have passwords
    });

    return await this.userRepository.save(user);
  }

  /**
   * Generate JWT access and refresh tokens
   * 
   * @param user - User entity
   * @returns Object with accessToken and refreshToken
   */
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    console.log('[AuthService] Generating tokens for user:', user.id);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
    });

    console.log('[AuthService] Tokens generated successfully');
    return { accessToken, refreshToken };
  }

  /**
   * Sanitize user object (remove sensitive data)
   * 
   * @param user - User entity
   * @returns Sanitized user object
   */
  sanitizeUser(user: User): any {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Refresh access token
   * 
   * @param refreshToken - Refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    console.log('[AuthService] Refreshing token...');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
      });

      console.log('[AuthService] Token refreshed successfully');
      return { accessToken };
    } catch (error) {
      console.error('[AuthService] Token refresh failed:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
