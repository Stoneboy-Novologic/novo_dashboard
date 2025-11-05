/**
 * Projects Module
 * 
 * Module for project management functionality.
 * 
 * @module ProjectsModule
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

/**
 * Projects Module
 * 
 * Provides project management functionality including:
 * - CRUD operations for projects
 * - Member management
 * - Project status workflow
 */
@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {
  constructor() {
    console.log('[ProjectsModule] Projects module initialized');
  }
}
