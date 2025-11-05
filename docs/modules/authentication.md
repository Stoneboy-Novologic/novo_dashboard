# Authentication Module

## Overview

The authentication module provides user authentication and authorization functionality using JWT tokens and OAuth 2.0.

## Features

- User registration with email/password
- User login with email/password
- JWT token generation and validation
- OAuth 2.0 integration (Google, Microsoft)
- Token refresh mechanism
- Role-based access control

## Flow Diagrams

### Registration Flow

```
User → Frontend → POST /api/auth/register
                    ↓
                AuthController
                    ↓
                AuthService.register()
                    ↓
            Check if email exists
                    ↓
            Hash password (bcrypt)
                    ↓
            Create user in database
                    ↓
            Generate JWT tokens
                    ↓
            Return tokens + user data
```

### Login Flow

```
User → Frontend → POST /api/auth/login
                    ↓
                AuthController
                    ↓
                AuthService.login()
                    ↓
            Find user by email
                    ↓
            Verify password (bcrypt.compare)
                    ↓
            Check if user is active
                    ↓
            Generate JWT tokens
                    ↓
            Return tokens + user data
```

### OAuth Flow (Google/Microsoft)

```
User → Frontend → GET /api/auth/google
                    ↓
                GoogleStrategy
                    ↓
            Redirect to OAuth provider
                    ↓
            User authorizes application
                    ↓
            Provider redirects to callback
                    ↓
            Exchange code for tokens
                    ↓
            Fetch user profile
                    ↓
            AuthService.findOrCreateOAuthUser()
                    ↓
            Generate JWT tokens
                    ↓
            Return tokens + user data
```

### Protected Route Flow

```
Request → JwtAuthGuard
            ↓
        Extract token from header
            ↓
        JwtStrategy.validate()
            ↓
        Verify token signature
            ↓
        AuthService.validateUser()
            ↓
        Attach user to request
            ↓
        Controller handler
```

## API Endpoints

### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "viewer"
  }
}
```

### POST /api/auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Same as register endpoint

### POST /api/auth/refresh

Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/auth/google

Initiate Google OAuth flow.

### GET /api/auth/google/callback

Google OAuth callback endpoint.

### GET /api/auth/microsoft

Initiate Microsoft OAuth flow.

### GET /api/auth/microsoft/callback

Microsoft OAuth callback endpoint.

## Guards

### JwtAuthGuard

Protects routes that require authentication.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

### RolesGuard

Protects routes based on user roles.

**Usage:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
@Get('admin')
adminRoute() {
  return 'Admin only';
}
```

## Decorators

### @CurrentUser()

Extracts the authenticated user from the request.

**Usage:**
```typescript
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

### @Roles()

Specifies required roles for a route.

**Usage:**
```typescript
@Roles(UserRole.ADMIN)
@Get('admin')
adminRoute() {
  return 'Admin only';
}
```

## User Roles

- `ADMIN`: Full system access
- `PROJECT_MANAGER`: Can manage projects
- `CONTRACTOR`: Can view and update assigned tasks
- `SUPERVISOR`: Can view and update project information
- `VIEWER`: Read-only access

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Expiration**: Access tokens expire in 1 hour, refresh tokens in 7 days
3. **Token Storage**: Tokens should be stored securely (httpOnly cookies recommended for production)
4. **OAuth State**: OAuth flows should include state parameter for CSRF protection (to be implemented)
