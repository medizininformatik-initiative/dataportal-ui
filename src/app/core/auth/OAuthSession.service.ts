import { Injectable } from '@angular/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class OAuthSessionService {
  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.events.subscribe((event: OAuthEvent) => {
      console.log('OAuth event:', event);

      switch (event.type) {
        case 'session_terminated':
        case 'session_error':
          this.logout('Session invalid');
          break;

        case 'session_changed':
          this.logout('Session changed');
          break;

        case 'token_error':
        case 'token_validation_error':
          this.logout('Token error');
          break;

        case 'token_refresh_error':
        case 'silent_refresh_error':
        case 'silent_refresh_timeout':
          this.logout('Silent refresh failed');
          break;

        case 'token_revoke_error':
          this.logout('Token revoke error');
          break;

        case 'code_error':
          this.logout('Authorization code error');
          break;

        case 'invalid_nonce_in_state':
          this.logout('Security validation failed');
          break;

        case 'token_expires':
          this.oauthService.silentRefresh().catch(() => {
            this.logout('Token refresh failed');
          });
          break;

        case 'logout':
          console.log('User logged out');
          break;

        default:
          // informational events
          break;
      }
    });
  }

  public isSessionValid(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public getSessionRemainingTime(): number {
    const expiration = this.oauthService.getAccessTokenExpiration();
    const now = new Date().getTime();
    const time = Math.max(expiration - now, 0);
    return time;
  }

  public getSessionRemainingSeconds(): number {
    const seconds = Math.floor(this.getSessionRemainingTime() / 1000);
    return seconds;
  }

  private logout(reason: string) {
    console.warn('Logging out:', reason);
    this.oauthService.logOut(false);
    this.router.navigate(['/login']);
  }

  private getSessionRemainingFormatted(): string {
    const seconds = this.getSessionRemainingSeconds();
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    const remainingTime = `${minutes}:${remaining.toString().padStart(2, '0')}`;
    console.log('Session remaining time (formatted):', remainingTime);
    return remainingTime;
  }
}
