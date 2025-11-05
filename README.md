# Construction Management SaaS Dashboard

A comprehensive construction management platform built with Next.js (frontend) and NestJS (backend) in an Nx monorepo.

## Architecture

This project uses an Nx monorepo structure with:

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: NestJS with TypeORM, PostgreSQL, JWT + OAuth authentication
- **Shared Libraries**: Types, utilities, configuration, and API client

## Project Structure

```
construction-management-v1/
├── apps/
│   ├── app/          # Next.js frontend application
│   └── api/          # NestJS backend API
├── libs/
│   └── shared/       # Shared libraries
│       ├── types/    # Shared TypeScript types
│       ├── utils/    # Shared utility functions
│       ├── config/   # Shared configuration
│       └── api-client/ # API client for frontend
├── docs/             # Documentation
└── package.json      # Root package.json with workspace dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Nx CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb construction_mgmt

# Or using psql:
psql -U postgres -c "CREATE DATABASE construction_mgmt;"
```

4. Start the development servers:

```bash
# Start frontend (port 3000)
npm run dev:app

# Start backend (port 3001)
npm run dev:api
```

## Environment Variables

See `.env.example` for required environment variables.

### Required Variables

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
- `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID (optional)
- `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth client secret (optional)

## Available Scripts

### Root Level

- `npm run build` - Build all applications
- `npm run dev` - Start all applications in development mode
- `npm run lint` - Lint all applications
- `npm run test` - Run tests for all applications

### Frontend (app)

- `npm run dev:app` - Start Next.js development server
- `npm run build:app` - Build Next.js application
- `npm run start:app` - Start production server

### Backend (api)

- `npm run dev:api` - Start NestJS development server
- `npm run build:api` - Build NestJS application
- `npm run start:api` - Start production server

## Implemented Features

### ✅ Completed

1. **Nx Monorepo Setup**
   - Workspace configuration
   - Shared libraries structure
   - TypeScript path mappings

2. **Frontend (Next.js)**
   - Converted to Nx workspace
   - UI component library (shadcn/ui)
   - Dashboard structure

3. **Backend (NestJS)**
   - Application scaffolding
   - Database configuration (TypeORM + PostgreSQL)
   - Authentication module (JWT + OAuth)
   - Projects module (CRUD + member management)
   - Error handling and logging
   - Security middleware (Helmet, CORS)

4. **Shared Libraries**
   - Type definitions
   - Utility functions
   - Configuration management
   - API client

### 🚧 Remaining Modules

The following modules are planned but not yet implemented:

- Tasks module
- Budget module
- RFI (Request for Information) module
- Documents module
- Chat module (with WebSocket)
- Reports module
- Invoicing module
- Site Diary module
- Risk Management module

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/microsoft` - Initiate Microsoft OAuth
- `GET /api/auth/microsoft/callback` - Microsoft OAuth callback

### Projects Endpoints

- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:memberId` - Remove member

## Development Guidelines

### Code Style

- Use TypeScript for all code
- Follow NestJS conventions for backend
- Follow Next.js conventions for frontend
- Add comprehensive comments and console logs for debugging

### Error Handling

- Use global exception filters for consistent error responses
- Log all errors with appropriate context
- Return standardized error response format

### Testing

- Write unit tests for services
- Write integration tests for controllers
- Use Jest as the testing framework

## Documentation

See the `docs/` directory for detailed documentation:

- `docs/api/` - API endpoint documentation
- `docs/architecture/` - Architecture diagrams and explanations
- `docs/modules/` - Module-specific documentation
- `docs/deployment/` - Deployment guides (including [Vercel Deployment Guide](docs/deployment/vercel-deployment.md))

## Deployment

### Frontend Deployment (Vercel)

The frontend Next.js application can be deployed to Vercel. See the [Vercel Deployment Guide](docs/deployment/vercel-deployment.md) for detailed instructions.

**Quick Start:**
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npx nx build app`
   - Output Directory: `dist/apps/app`
   - Framework: Next.js
3. Add environment variables (see deployment guide)
4. Deploy!

### Backend Deployment

The backend NestJS API can be deployed to platforms like:
- Railway
- Render
- AWS Elastic Beanstalk
- Heroku
- DigitalOcean App Platform

See backend-specific documentation for deployment instructions.

## License

MIT
