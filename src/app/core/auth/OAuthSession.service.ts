import { Injectable, inject } from '@angular/core'
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc'

@Injectable({ providedIn: 'root' })
export class OAuthSessionService {
  private oauthService = inject(OAuthService)
  private isLoggingOut = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Starts the session-expiry logout handling. Call after the initial login succeeded,
   * so errors of the login itself (stale code, bad nonce) do not trigger a logout.
   * Token refresh is left to setupAutomaticSilentRefresh (see OAuthInit.service).
   */
  public start(): void {
    this.oauthService.events.subscribe((event: OAuthEvent) => {
      switch (event.type) {
        case 'session_terminated':
        case 'session_error':
          this.logout('Session invalid')
          break

        case 'session_changed':
          this.logout('Session changed')
          break

        case 'token_error':
        case 'token_validation_error':
          this.logout('Token error')
          break

        case 'token_refresh_error':
        case 'silent_refresh_error':
        case 'silent_refresh_timeout':
          this.logout('Silent refresh failed')
          break

        case 'token_revoke_error':
          this.logout('Token revoke error')
          break

        case 'code_error':
          this.logout('Authorization code error')
          break

        case 'invalid_nonce_in_state':
          this.logout('Security validation failed')
          break

        default:
          // informational events
          break
      }
    })
  }

  public isSessionValid(): boolean {
    return this.oauthService.hasValidAccessToken()
  }

  public getSessionRemainingTime(): number {
    const expiration = this.oauthService.getAccessTokenExpiration()
    const now = new Date().getTime()
    const time = Math.max(expiration - now, 0)
    return time
  }

  public getSessionRemainingSeconds(): number {
    const seconds = Math.floor(this.getSessionRemainingTime() / 1000)
    return seconds
  }

  public logout(reason: string) {
    const time = new Date().toLocaleTimeString()
    console.warn(time, 'Logging out:', reason)
    if (this.isLoggingOut) {
      return
    }
    this.isLoggingOut = true
    // Keycloak rejects post_logout_redirect_uri (400) without id_token_hint or client_id
    const clientId = this.oauthService.clientId
    // redirects the browser to Keycloak logout, then back to redirectUri, which starts a new login
    this.oauthService.logOut({ client_id: clientId })
  }
}
