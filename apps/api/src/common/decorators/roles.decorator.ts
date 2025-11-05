/**
 * Roles Decorator
 * 
 * Decorator to specify required roles for a route.
 * 
 * @module RolesDecorator
 */

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@construction-mgmt/shared/types';

/**
 * Roles Metadata Key
 */
export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * 
 * Specifies which roles are required to access a route.
 * 
 * Usage:
 * @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
 * @Get('admin')
 * adminRoute() {
 *   return 'Admin only';
 * }
 */
export const Roles = (...roles: UserRole[]) => {
  console.log('[Roles] Setting required roles:', roles);
  return SetMetadata(ROLES_KEY, roles);
};
