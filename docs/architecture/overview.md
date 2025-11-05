# Architecture Overview

## System Architecture

The Construction Management SaaS Dashboard follows a modern microservices-inspired architecture within a monorepo structure.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │   Shared     │     │
│  │              │  │              │  │   Libraries   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Controllers │  │   Services    │  │   Entities    │     │
│  │              │  │              │  │               │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Guards     │  │   Filters    │  │  Interceptors │     │
│  │              │  │              │  │               │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ TypeORM
                            │
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Authentication Flow

```
1. User submits login credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. AuthController receives request
   ↓
4. AuthService validates credentials
   ↓
5. AuthService generates JWT tokens
   ↓
6. Response sent with tokens and user data
   ↓
7. Frontend stores tokens in localStorage
   ↓
8. Subsequent requests include JWT in Authorization header
```

### Protected Route Flow

```
1. Frontend makes authenticated request
   ↓
2. Request includes JWT in Authorization header
   ↓
3. JwtAuthGuard intercepts request
   ↓
4. JwtStrategy validates token
   ↓
5. User object attached to request
   ↓
6. Controller handler executes
   ↓
7. Service performs business logic
   ↓
8. Response sent back to frontend
```

## Module Structure

### Backend Modules

Each module follows NestJS conventions:

```
module-name/
├── dto/              # Data Transfer Objects
├── module-name.controller.ts
├── module-name.service.ts
└── module-name.module.ts
```

### Shared Libraries

```
libs/shared/
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
├── config/           # Configuration constants
└── api-client/       # Frontend API client
```

## Database Schema

### Core Entities

- **User**: User accounts with authentication
- **Project**: Construction projects
- **Task**: Tasks within projects
- **ProjectMember**: Many-to-many relationship between users and projects

### Relationships

```
User 1───N Project (owner)
User N───N Project (members)
Project 1───N Task
Task N───N Task (dependencies)
```

## Security Architecture

### Authentication

- JWT-based authentication for API access
- OAuth 2.0 for Google and Microsoft
- Password hashing with bcrypt

### Authorization

- Role-based access control (RBAC)
- Project-level permissions
- Guards for route protection

### Security Middleware

- Helmet for security headers
- CORS configuration
- Rate limiting (to be implemented)
- Input validation with class-validator

## Error Handling

### Exception Filters

1. **AllExceptionsFilter**: Catches all exceptions
2. **HttpExceptionFilter**: Handles HTTP exceptions

### Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/projects",
  "method": "POST",
  "error": "Validation failed",
  "details": ["name is required"]
}
```

## Logging

### Log Levels

- **info**: General information
- **warn**: Warning messages
- **error**: Error messages with stack traces

### Logging Interceptor

- Logs all incoming requests
- Logs response times
- Logs errors with context

## Deployment Considerations

### Environment Variables

All configuration should be externalized via environment variables.

### Database Migrations

TypeORM migrations should be used in production (currently using synchronize in development).

### Build Process

- Frontend: Next.js build with static optimization
- Backend: NestJS build with webpack
- Shared libraries: Compiled TypeScript
