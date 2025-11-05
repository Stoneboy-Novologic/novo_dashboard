# Projects Module

## Overview

The projects module manages construction projects, including CRUD operations and member management.

## Features

- Create, read, update, delete projects
- Add/remove project members
- Project status workflow
- Project ownership and permissions

## Flow Diagrams

### Create Project Flow

```
User → POST /api/projects
        ↓
    ProjectsController.create()
        ↓
    ProjectsService.create()
        ↓
    Verify owner exists
        ↓
    Create project entity
        ↓
    Save to database
        ↓
    Add owner as member
        ↓
    Return project
```

### Add Member Flow

```
User → POST /api/projects/:id/members
        ↓
    ProjectsController.addMember()
        ↓
    ProjectsService.addMember()
        ↓
    Verify user has permission (owner/manager)
        ↓
    Verify user exists
        ↓
    Check if user is already a member
        ↓
    Add user to project members
        ↓
    Save to database
        ↓
    Return updated project
```

## API Endpoints

### POST /api/projects

Create a new project.

**Request Body:**
```json
{
  "name": "New Construction Project",
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 1000000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "New Construction Project",
  "description": "Project description",
  "status": "planning",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "budget": 1000000,
  "ownerId": "uuid",
  "owner": { ... },
  "members": [ ... ],
  "tasks": [ ... ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/projects

Get all projects for the current user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Project 1",
    ...
  },
  ...
]
```

### GET /api/projects/:id

Get a project by ID.

**Response:** Same as create project response

### PATCH /api/projects/:id

Update a project.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "status": "in_progress",
  "budget": 1200000
}
```

**Response:** Updated project object

### DELETE /api/projects/:id

Delete a project. Only the project owner can delete.

**Response:** 204 No Content

### POST /api/projects/:id/members

Add a member to a project.

**Request Body:**
```json
{
  "userId": "uuid",
  "role": "member"
}
```

**Response:** Updated project object

### DELETE /api/projects/:id/members/:memberId

Remove a member from a project.

**Response:** Updated project object

## Project Status

- `PLANNING`: Project is in planning phase
- `IN_PROGRESS`: Project is actively being worked on
- `ON_HOLD`: Project is temporarily paused
- `COMPLETED`: Project is finished
- `CANCELLED`: Project has been cancelled

## Project Roles

- `OWNER`: Project creator, full control
- `MANAGER`: Can manage project and members
- `MEMBER`: Can view and update project information
- `VIEWER`: Read-only access

## Permissions

### Create Project
- Any authenticated user can create a project

### Update Project
- Only project owner or managers can update

### Delete Project
- Only project owner can delete

### Add/Remove Members
- Only project owner or managers can add/remove members

## Database Schema

### Project Entity

```typescript
{
  id: string (UUID)
  name: string
  description: string (optional)
  status: ProjectStatus (enum)
  startDate: Date
  endDate: Date (optional)
  budget: number (optional)
  ownerId: string (UUID, FK to User)
  createdAt: Date
  updatedAt: Date
}
```

### Relationships

- Project belongs to User (owner)
- Project has many Users (members) - many-to-many
- Project has many Tasks - one-to-many
