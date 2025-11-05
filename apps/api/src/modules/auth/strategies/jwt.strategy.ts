/**
 * JWT Strategy
 * 
 * Passport strategy for JWT authentication.
 * Validates JWT tokens and extracts user information.
 * 
 * @module JwtStrategy
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AUTH_CONFIG } from '@construction-mgmt/shared/config';

/**
 * JWT Strategy
 * 
 * Validates JWT tokens from Authorization header.
 * 
 * Flow:
 * 1. Extract token from Authorization header
 * 2. Verify token signature and expiration
 * 3. Call validate method with payload
 * 4. Return user object
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONFIG.JWT_SECRET,
    });
    console.log('[JwtStrategy] Initializing JWT strategy...');
  }

  /**
   * Validate JWT payload
   * 
   * This method is called after JWT token is verified.
   * It should return the user object that will be attached to the request.
   * 
   * @param payload - Decoded JWT payload
   * @returns User object
   */
  async validate(payload: any) {
    console.log('[JwtStrategy] Validating JWT payload:', payload.sub);
    
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      console.log('[JwtStrategy] User validation failed');
      throw new UnauthorizedException();
    }

    console.log('[JwtStrategy] User validated successfully');
    return user;
  }
}
