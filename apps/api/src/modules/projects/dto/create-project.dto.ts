/**
 * Create Project DTO
 * 
 * Data Transfer Object for creating a new project.
 * 
 * @module CreateProjectDto
 */

import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

/**
 * Create Project DTO
 * 
 * Validates project creation data.
 */
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}
