/**
 * Google OAuth Strategy
 * 
 * Passport strategy for Google OAuth authentication.
 * 
 * @module GoogleStrategy
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { OAUTH_CONFIG } from '@construction-mgmt/shared/config';

/**
 * Google OAuth Strategy
 * 
 * Handles Google OAuth authentication flow.
 * 
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Redirect to Google OAuth consent screen
 * 3. User authorizes application
 * 4. Google redirects back with authorization code
 * 5. Exchange code for access token
 * 6. Fetch user profile from Google
 * 7. Call validate method with profile
 * 8. Find or create user in database
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: OAUTH_CONFIG.GOOGLE.CLIENT_ID,
      clientSecret: OAUTH_CONFIG.GOOGLE.CLIENT_SECRET,
      callbackURL: OAUTH_CONFIG.GOOGLE.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
    console.log('[GoogleStrategy] Initializing Google OAuth strategy...');
  }

  /**
   * Validate Google OAuth profile
   * 
   * @param accessToken - Google access token
   * @param refreshToken - Google refresh token
   * @param profile - Google user profile
   * @param done - Passport callback
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('[GoogleStrategy] Validating Google profile:', profile.emails[0].value);
    
    const user = await this.authService.findOrCreateOAuthUser(profile, 'google');
    
    console.log('[GoogleStrategy] Google authentication successful');
    done(null, user);
  }
}
