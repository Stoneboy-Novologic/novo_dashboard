/**
 * Task Entity
 * 
 * Database entity representing a task within a project.
 * Maps to the 'tasks' table in PostgreSQL.
 * 
 * @module TaskEntity
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TaskStatus, TaskPriority } from '@construction-mgmt/shared/types';
import { Project } from './project.entity';
import { User } from './user.entity';

/**
 * Task Entity
 * 
 * Represents a task within a construction project.
 * 
 * Entity Relationships:
 * - Many-to-One: Project
 * - Many-to-One: Assigned User
 * - Many-to-Many: Dependencies (self-referential)
 */
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ name: 'projectId' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ name: 'assignedToId', nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  // Dependencies - self-referential many-to-many
  @ManyToMany(() => Task, (task) => task.dependents)
  @JoinTable({
    name: 'task_dependencies',
    joinColumn: { name: 'taskId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'dependencyId', referencedColumnName: 'id' },
  })
  dependencies: Task[];

  @ManyToMany(() => Task, (task) => task.dependencies)
  dependents: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
