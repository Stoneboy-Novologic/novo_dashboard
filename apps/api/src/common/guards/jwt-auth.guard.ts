/**
 * JWT Authentication Guard
 * 
 * Protects routes that require JWT authentication.
 * 
 * @module JwtAuthGuard
 */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT Authentication Guard
 * 
 * Extends Passport's AuthGuard to protect routes with JWT authentication.
 * Can be used with @UseGuards(JwtAuthGuard) decorator.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
    console.log('[JwtAuthGuard] Initializing JWT authentication guard...');
  }

  canActivate(context: ExecutionContext) {
    console.log('[JwtAuthGuard] Checking authentication...');
    return super.canActivate(context);
  }
}
