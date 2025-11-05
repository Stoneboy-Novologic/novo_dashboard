/**
 * Root Application Service
 * 
 * Provides business logic for root-level endpoints.
 * 
 * @module AppService
 */

import { Injectable } from '@nestjs/common';

/**
 * Root Application Service
 * 
 * Contains business logic for application-level operations.
 */
@Injectable()
export class AppService {
  constructor() {
    console.log('[AppService] Initializing root application service...');
  }

  /**
   * Get application health status
   * 
   * @returns Health status object
   */
  getHealth() {
    console.log('[AppService] Getting health status');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * Get API information
   * 
   * @returns API information object
   */
  getInfo() {
    console.log('[AppService] Getting API information');
    return {
      name: 'Construction Management API',
      version: '1.0.0',
      description: 'Backend API for Construction Management SaaS Dashboard',
      status: 'running',
    };
  }
}
