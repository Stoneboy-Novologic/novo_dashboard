/**
 * Add Member DTO
 * 
 * Data Transfer Object for adding a member to a project.
 * 
 * @module AddMemberDto
 */

import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from '@construction-mgmt/shared/types';

/**
 * Add Member DTO
 * 
 * Validates data for adding a member to a project.
 */
export class AddMemberDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole = ProjectRole.MEMBER;
}
