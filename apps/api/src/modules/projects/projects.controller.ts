/**
 * Projects Controller
 * 
 * Handles HTTP requests for project management.
 * 
 * @module ProjectsController
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

/**
 * Projects Controller
 * 
 * Provides endpoints for:
 * - POST /api/projects - Create project
 * - GET /api/projects - Get all projects
 * - GET /api/projects/:id - Get project by ID
 * - PATCH /api/projects/:id - Update project
 * - DELETE /api/projects/:id - Delete project
 * - POST /api/projects/:id/members - Add member
 * - DELETE /api/projects/:id/members/:memberId - Remove member
 */
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {
    console.log('[ProjectsController] Initializing projects controller...');
  }

  /**
   * Create a new project
   * POST /api/projects
   */
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    console.log('[ProjectsController] Create project request');
    return this.projectsService.create(createProjectDto, user.id);
  }

  /**
   * Get all projects for the current user
   * GET /api/projects
   */
  @Get()
  findAll(@CurrentUser() user: User) {
    console.log('[ProjectsController] Get all projects request');
    return this.projectsService.findAll(user.id);
  }

  /**
   * Get a project by ID
   * GET /api/projects/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    console.log('[ProjectsController] Get project request:', id);
    return this.projectsService.findOne(id, user.id);
  }

  /**
   * Update a project
   * PATCH /api/projects/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    console.log('[ProjectsController] Update project request:', id);
    return this.projectsService.update(id, updateProjectDto, user.id);
  }

  /**
   * Delete a project
   * DELETE /api/projects/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    console.log('[ProjectsController] Delete project request:', id);
    return this.projectsService.remove(id, user.id);
  }

  /**
   * Add a member to a project
   * POST /api/projects/:id/members
   */
  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @CurrentUser() user: User,
  ) {
    console.log('[ProjectsController] Add member request:', id);
    return this.projectsService.addMember(id, addMemberDto, user.id);
  }

  /**
   * Remove a member from a project
   * DELETE /api/projects/:id/members/:memberId
   */
  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: User,
  ) {
    console.log('[ProjectsController] Remove member request:', projectId, memberId);
    return this.projectsService.removeMember(projectId, memberId, user.id);
  }
}
