/**
 * Root Application Controller
 * 
 * Handles root-level API endpoints such as health checks.
 * 
 * @module AppController
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root Application Controller
 * 
 * Provides basic API endpoints for application health and status.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('[AppController] Initializing root application controller...');
  }

  /**
   * Health check endpoint
   * GET /api/health
   * 
   * Returns the health status of the API
   * 
   * @returns Health status object
   */
  @Get('health')
  getHealth() {
    console.log('[AppController] Health check requested');
    return this.appService.getHealth();
  }

  /**
   * Root endpoint
   * GET /api
   * 
   * Returns basic API information
   * 
   * @returns API information object
   */
  @Get()
  getInfo() {
    console.log('[AppController] Root endpoint requested');
    return this.appService.getInfo();
  }
}
