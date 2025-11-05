/**
 * Shared Types Library
 * 
 * This library contains shared TypeScript interfaces and types
 * used across both frontend and backend applications.
 * 
 * @module @construction-mgmt/shared/types
 */

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  CONTRACTOR = 'contractor',
  SUPERVISOR = 'supervisor',
  VIEWER = 'viewer',
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  ownerId: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
}

export enum ProjectRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignedToId?: string;
  dueDate?: Date;
  dependencies: string[];
  subtasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Budget Types
export interface Budget {
  id: string;
  projectId: string;
  totalAmount: number;
  allocatedAmount: number;
  spentAmount: number;
  lineItems: BudgetLineItem[];
  status: BudgetStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLineItem {
  id: string;
  category: string;
  description: string;
  allocatedAmount: number;
  spentAmount: number;
  variance: number;
}

export enum BudgetStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// RFI Types
export interface RFI {
  id: string;
  projectId: string;
  number: string;
  subject: string;
  description: string;
  status: RFIStatus;
  requestedBy: string;
  assignedTo?: string;
  responses: RFIResponse[];
  attachments: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export enum RFIStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  RESPONDED = 'responded',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export interface RFIResponse {
  id: string;
  rfiId: string;
  response: string;
  respondedBy: string;
  attachments: Document[];
  createdAt: Date;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  projectId?: string;
  uploadedBy: string;
  version: number;
  previousVersionId?: string;
  sharedWith: string[];
  permissions: DocumentPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentPermissions {
  canView: string[];
  canEdit: string[];
  canDelete: string[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  sender: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  reactions: Record<string, string[]>;
  attachment?: Document;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isPinned: boolean;
  tags?: string[];
  isOnline?: boolean;
  lastSeen?: Date;
}

// Invoice Types
export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  amount: number;
  lineItems: InvoiceLineItem[];
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  issuedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

// Site Diary Types
export interface SiteDiaryEntry {
  id: string;
  projectId: string;
  date: Date;
  weather?: string;
  siteConditions?: string;
  notes: string;
  photos: Document[];
  createdBy: string;
  status: SiteDiaryStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SiteDiaryStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Risk Types
export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  probability: RiskProbability;
  impact: string;
  status: RiskStatus;
  mitigationPlan?: string;
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RiskProbability {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  CLOSED = 'closed',
}

// Report Types
export interface Report {
  id: string;
  projectId: string;
  type: ReportType;
  title: string;
  generatedAt: Date;
  generatedBy: string;
  data: Record<string, any>;
  exportFormats: string[];
}

export enum ReportType {
  BUDGET = 'budget',
  RESOURCE = 'resource',
  SAFETY = 'safety',
  SCHEDULE = 'schedule',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
