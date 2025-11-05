/**
 * Update Project DTO
 * 
 * Data Transfer Object for updating a project.
 * 
 * @module UpdateProjectDto
 */

import { IsString, IsOptional, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { ProjectStatus } from '@construction-mgmt/shared/types';

/**
 * Update Project DTO
 * 
 * Validates project update data.
 */
export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}
