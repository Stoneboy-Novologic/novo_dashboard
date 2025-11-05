/**
 * Projects Service
 * 
 * Handles business logic for project management.
 * 
 * @module ProjectsService
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ProjectRole, ProjectStatus } from '@construction-mgmt/shared/types';

/**
 * Projects Service
 * 
 * Provides methods for:
 * - Creating projects
 * - Updating projects
 * - Deleting projects
 * - Managing project members
 * - Querying projects
 * 
 * Service Flow:
 * 1. Create: Validate data -> Create project -> Set owner -> Save
 * 2. Update: Find project -> Check permissions -> Update -> Save
 * 3. Add Member: Find project -> Check permissions -> Add member -> Save
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    console.log('[ProjectsService] Initializing projects service...');
  }

  /**
   * Create a new project
   * 
   * @param createProjectDto - Project data
   * @param ownerId - ID of the user creating the project
   * @returns Created project
   */
  async create(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    console.log('[ProjectsService] Creating new project:', createProjectDto.name);

    // Verify owner exists
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      console.log('[ProjectsService] Owner not found:', ownerId);
      throw new NotFoundException('Owner not found');
    }

    // Create project
    const project = this.projectRepository.create({
      ...createProjectDto,
      ownerId,
      status: ProjectStatus.PLANNING,
    });

    const savedProject = await this.projectRepository.save(project);
    console.log('[ProjectsService] Project created successfully:', savedProject.id);

    // Add owner as member
    savedProject.members = [owner];
    await this.projectRepository.save(savedProject);

    return this.findOne(savedProject.id, ownerId);
  }

  /**
   * Find all projects for a user
   * 
   * @param userId - User ID
   * @returns Array of projects
   */
  async findAll(userId: string): Promise<Project[]> {
    console.log('[ProjectsService] Finding all projects for user:', userId);

    const projects = await this.projectRepository.find({
      where: [
        { ownerId: userId },
        { members: { id: userId } },
      ],
      relations: ['owner', 'members', 'tasks'],
      order: { createdAt: 'DESC' },
    });

    console.log('[ProjectsService] Found', projects.length, 'projects');
    return projects;
  }

  /**
   * Find a single project by ID
   * 
   * @param id - Project ID
   * @param userId - User ID (for permission check)
   * @returns Project entity
   * @throws NotFoundException if project not found
   * @throws ForbiddenException if user doesn't have access
   */
  async findOne(id: string, userId: string): Promise<Project> {
    console.log('[ProjectsService] Finding project:', id);

    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks'],
    });

    if (!project) {
      console.log('[ProjectsService] Project not found:', id);
      throw new NotFoundException('Project not found');
    }

    // Check if user has access
    const hasAccess =
      project.ownerId === userId ||
      project.members.some((member) => member.id === userId);

    if (!hasAccess) {
      console.log('[ProjectsService] Access denied for user:', userId);
      throw new ForbiddenException('You do not have access to this project');
    }

    console.log('[ProjectsService] Project found successfully');
    return project;
  }

  /**
   * Update a project
   * 
   * @param id - Project ID
   * @param updateProjectDto - Update data
   * @param userId - User ID (for permission check)
   * @returns Updated project
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    console.log('[ProjectsService] Updating project:', id);

    const project = await this.findOne(id, userId);

    // Check if user is owner or manager
    const isOwner = project.ownerId === userId;
    const isManager = project.members.some(
      (member) => member.id === userId && member.role === ProjectRole.MANAGER,
    );

    if (!isOwner && !isManager) {
      console.log('[ProjectsService] Update denied: Insufficient permissions');
      throw new ForbiddenException('Only owners and managers can update projects');
    }

    // Update project
    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectRepository.save(project);

    console.log('[ProjectsService] Project updated successfully');
    return this.findOne(updatedProject.id, userId);
  }

  /**
   * Delete a project
   * 
   * @param id - Project ID
   * @param userId - User ID (for permission check)
   * @throws ForbiddenException if user is not owner
   */
  async remove(id: string, userId: string): Promise<void> {
    console.log('[ProjectsService] Deleting project:', id);

    const project = await this.findOne(id, userId);

    // Only owner can delete
    if (project.ownerId !== userId) {
      console.log('[ProjectsService] Delete denied: Only owner can delete');
      throw new ForbiddenException('Only the project owner can delete the project');
    }

    await this.projectRepository.remove(project);
    console.log('[ProjectsService] Project deleted successfully');
  }

  /**
   * Add a member to a project
   * 
   * @param id - Project ID
   * @param addMemberDto - Member data
   * @param userId - User ID (for permission check)
   * @returns Updated project
   */
  async addMember(
    id: string,
    addMemberDto: AddMemberDto,
    userId: string,
  ): Promise<Project> {
    console.log('[ProjectsService] Adding member to project:', id);

    const project = await this.findOne(id, userId);

    // Check if user is owner or manager
    const isOwner = project.ownerId === userId;
    const isManager = project.members.some(
      (member) => member.id === userId && member.role === ProjectRole.MANAGER,
    );

    if (!isOwner && !isManager) {
      console.log('[ProjectsService] Add member denied: Insufficient permissions');
      throw new ForbiddenException('Only owners and managers can add members');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      console.log('[ProjectsService] User not found:', addMemberDto.userId);
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(
      (member) => member.id === addMemberDto.userId,
    );

    if (isAlreadyMember) {
      console.log('[ProjectsService] User is already a member');
      throw new BadRequestException('User is already a member of this project');
    }

    // Add member
    project.members.push(user);
    await this.projectRepository.save(project);

    console.log('[ProjectsService] Member added successfully');
    return this.findOne(project.id, userId);
  }

  /**
   * Remove a member from a project
   * 
   * @param projectId - Project ID
   * @param memberId - Member ID to remove
   * @param userId - User ID (for permission check)
   * @returns Updated project
   */
  async removeMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    console.log('[ProjectsService] Removing member from project:', projectId);

    const project = await this.findOne(projectId, userId);

    // Check if user is owner or manager
    const isOwner = project.ownerId === userId;
    const isManager = project.members.some(
      (member) => member.id === userId && member.role === ProjectRole.MANAGER,
    );

    if (!isOwner && !isManager) {
      console.log('[ProjectsService] Remove member denied: Insufficient permissions');
      throw new ForbiddenException('Only owners and managers can remove members');
    }

    // Cannot remove owner
    if (memberId === project.ownerId) {
      console.log('[ProjectsService] Cannot remove project owner');
      throw new BadRequestException('Cannot remove the project owner');
    }

    // Remove member
    project.members = project.members.filter((member) => member.id !== memberId);
    await this.projectRepository.save(project);

    console.log('[ProjectsService] Member removed successfully');
    return this.findOne(project.id, userId);
  }
}
