/**
 * Microsoft OAuth Strategy
 * 
 * Passport strategy for Microsoft OAuth authentication.
 * 
 * @module MicrosoftStrategy
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-microsoft';
import { AuthService } from '../auth.service';
import { OAUTH_CONFIG } from '@construction-mgmt/shared/config';

/**
 * Microsoft OAuth Strategy
 * 
 * Handles Microsoft OAuth authentication flow.
 * 
 * Flow:
 * 1. User clicks "Sign in with Microsoft"
 * 2. Redirect to Microsoft OAuth consent screen
 * 3. User authorizes application
 * 4. Microsoft redirects back with authorization code
 * 5. Exchange code for access token
 * 6. Fetch user profile from Microsoft Graph
 * 7. Call validate method with profile
 * 8. Find or create user in database
 */
@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private authService: AuthService) {
    super({
      clientID: OAUTH_CONFIG.MICROSOFT.CLIENT_ID,
      clientSecret: OAUTH_CONFIG.MICROSOFT.CLIENT_SECRET,
      callbackURL: OAUTH_CONFIG.MICROSOFT.CALLBACK_URL,
      tenant: OAUTH_CONFIG.MICROSOFT.TENANT,
      scope: ['user.read'],
    });
    console.log('[MicrosoftStrategy] Initializing Microsoft OAuth strategy...');
  }

  /**
   * Validate Microsoft OAuth profile
   * 
   * @param accessToken - Microsoft access token
   * @param refreshToken - Microsoft refresh token
   * @param profile - Microsoft user profile
   * @param done - Passport callback
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('[MicrosoftStrategy] Validating Microsoft profile:', profile.emails[0].value);
    
    const user = await this.authService.findOrCreateOAuthUser(profile, 'microsoft');
    
    console.log('[MicrosoftStrategy] Microsoft authentication successful');
    done(null, user);
  }
}
