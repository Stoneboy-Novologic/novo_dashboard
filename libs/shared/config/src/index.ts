/**
 * Shared Configuration Library
 * 
 * This library contains shared configuration constants
 * and environment variable helpers used across applications.
 * 
 * @module @construction-mgmt/shared/config
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  COOKIE_NAME: 'construction-mgmt-token',
} as const;

/**
 * Database Configuration
 */
export const DB_CONFIG = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '5432', 10),
  USERNAME: process.env.DB_USERNAME || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DATABASE: process.env.DB_DATABASE || 'construction_mgmt',
  SYNCHRONIZE: process.env.NODE_ENV !== 'production',
  LOGGING: process.env.NODE_ENV === 'development',
} as const;

/**
 * OAuth Configuration
 */
export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
  },
  MICROSOFT: {
    CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || '',
    CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET || '',
    CALLBACK_URL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3001/api/auth/microsoft/callback',
    TENANT: process.env.MICROSOFT_TENANT || 'common',
  },
} as const;

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
} as const;

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  CREDENTIALS: true,
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
} as const;

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
} as const;

/**
 * Logging Configuration
 */
export const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || 'info',
  FORMAT: process.env.LOG_FORMAT || 'json',
  FILE_PATH: process.env.LOG_FILE_PATH || './logs',
} as const;

/**
 * Get environment variable with fallback
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Environment variable value or default
 */
export function getEnv(key: string, defaultValue?: string): string {
  console.log('[getEnv] Getting environment variable:', key);
  const value = process.env[key];
  if (!value && defaultValue) {
    console.log('[getEnv] Using default value for:', key);
    return defaultValue;
  }
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

/**
 * Check if running in production
 * @returns True if in production environment
 */
export function isProduction(): boolean {
  console.log('[isProduction] Checking environment:', process.env.NODE_ENV);
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 * @returns True if in development environment
 */
export function isDevelopment(): boolean {
  console.log('[isDevelopment] Checking environment:', process.env.NODE_ENV);
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}
