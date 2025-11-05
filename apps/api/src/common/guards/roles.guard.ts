/**
 * Roles Guard
 * 
 * Protects routes based on user roles.
 * 
 * @module RolesGuard
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@construction-mgmt/shared/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles Guard
 * 
 * Checks if the authenticated user has the required role(s).
 * Must be used after JwtAuthGuard.
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN)
 * @Get('admin')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    console.log('[RolesGuard] Initializing roles guard...');
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('[RolesGuard] Checking user roles...');
    
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      console.log('[RolesGuard] No roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      console.log('[RolesGuard] No user found in request');
      return false;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('[RolesGuard] User role check:', { userRole: user.role, requiredRoles, hasRole });
    
    return hasRole;
  }
}
