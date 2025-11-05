/**
 * Current User Decorator
 * 
 * Decorator to extract the current authenticated user from the request.
 * 
 * @module CurrentUserDecorator
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 * 
 * Extracts the authenticated user from the request object.
 * 
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log('[CurrentUser] Extracting current user from request...');
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
