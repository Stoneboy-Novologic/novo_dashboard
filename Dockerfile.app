# Multi-stage Dockerfile for Next.js Frontend Application
# This Dockerfile uses multi-stage builds to create optimized production images
#
# Build Flow:
# 1. Dependencies stage - Install all dependencies
# 2. Build stage - Build the Next.js application using Nx
# 3. Production stage - Copy only production files and run the app
#
# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
LABEL stage=dependencies

# Set working directory
WORKDIR /app

# Install build dependencies required for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy all project.json files to understand workspace structure
COPY apps/app/project.json ./apps/app/
COPY libs/shared/types/project.json ./libs/shared/types/
COPY libs/shared/utils/project.json ./libs/shared/utils/
COPY libs/shared/config/project.json ./libs/shared/config/
COPY libs/shared/api-client/project.json ./libs/shared/api-client/

# Install all dependencies (including dev dependencies for build)
# Use npm ci if package-lock.json exists, otherwise use npm install
RUN echo "[Dockerfile.app] Installing dependencies..." && \
    if [ -f package-lock.json ]; then \
        npm ci --legacy-peer-deps; \
    else \
        echo "[Dockerfile.app] package-lock.json not found, using npm install..." && \
        npm install --legacy-peer-deps; \
    fi && \
    echo "[Dockerfile.app] Dependencies installed successfully"

# Stage 2: Build
FROM node:20-alpine AS build
LABEL stage=build

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/nx.json ./nx.json
COPY --from=dependencies /app/tsconfig.base.json ./tsconfig.base.json

# Copy Next.js config and PostCSS config
COPY apps/app/next.config.mjs ./apps/app/
COPY apps/app/postcss.config.mjs ./apps/app/
COPY postcss.config.mjs ./

# Copy source code
COPY apps/app ./apps/app
COPY libs/shared ./libs/shared
COPY components ./components
COPY public ./public
COPY styles ./styles
COPY hooks ./hooks
COPY lib ./lib

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application using Nx
# This builds the app and all its dependencies
RUN echo "[Dockerfile.app] Building Next.js application..." && \
    npx nx build app --skip-nx-cache && \
    echo "[Dockerfile.app] Build completed successfully"

# Stage 3: Production
FROM node:20-alpine AS production
LABEL stage=production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files for production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
# Use npm ci if package-lock.json exists, otherwise use npm install
RUN echo "[Dockerfile.app] Installing production dependencies..." && \
    if [ -f package-lock.json ]; then \
        npm ci --omit=dev --legacy-peer-deps; \
    else \
        echo "[Dockerfile.app] package-lock.json not found, using npm install..." && \
        npm install --omit=dev --legacy-peer-deps; \
    fi && \
    echo "[Dockerfile.app] Production dependencies installed"

# Copy built application from build stage
# Next.js standalone output includes all necessary files
COPY --from=build --chown=nextjs:nodejs /app/dist/apps/app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/dist/apps/app/.next/static ./dist/apps/app/.next/static
COPY --from=build --chown=nextjs:nodejs /app/dist/apps/app/public ./dist/apps/app/public

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the Next.js application
CMD ["node", "dist/apps/app/server.js"]

