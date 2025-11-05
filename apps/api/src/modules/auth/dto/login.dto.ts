/**
 * Login DTO
 * 
 * Data Transfer Object for user login requests.
 * 
 * @module LoginDto
 */

import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Login DTO
 * 
 * Validates login request data.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
