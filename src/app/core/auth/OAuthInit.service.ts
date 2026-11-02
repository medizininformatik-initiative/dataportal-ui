import { Injectable, inject } from '@angular/core'
import { OAuthService } from 'angular-oauth2-oidc'
import { from, Observable, of, race, throwError, timer } from 'rxjs'
import { catchError, mapTo } from 'rxjs/operators'
import { AuthConfigService } from './AuthConfig.service'

@Injectable({
  providedIn: 'root',
})
export class OAuthInitService {
  private readonly oauthService = inject(OAuthService)
  private readonly authConfigService = inject(AuthConfigService)

  private readonly TERMINATION_TIMEOUT = 20_000

  private readonly ERROR_INIT_FAIL = 'App was not able to initialize the authentication service'
  private readonly ERROR_TIMEOUT = `${this.ERROR_INIT_FAIL} after waiting for ${this.TERMINATION_TIMEOUT} ms`

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Configures OAuth and starts the login, giving up after the termination timeout.
   * @returns {Observable<boolean>}
   */
  public initOAuth(): Observable<boolean> {
    this.configureAuthConfig()
    const timeout$ = this.setTimeoOut()
    const login$ = this.startOAuthLogin()
    return race([login$, timeout$]).pipe(catchError((err) => throwError(() => new Error(err.message || this.ERROR_INIT_FAIL))))
  }

  /**
   * Loads the discovery document and logs in, emitting whether a valid access token exists.
   * @returns {Observable<boolean>}
   */
  private startOAuthLogin(): Observable<boolean> {
    const init$ = from(
      this.oauthService.loadDiscoveryDocumentAndLogin().then((loggedIn: boolean) => {
        if (this.oauthService.hasValidAccessToken()) {
          this.oauthService.setupAutomaticSilentRefresh()
          return true
        } else {
          return false
        }
      })
    ).pipe(
      catchError((err) => {
        console.error('OAuth init error:', err)
        return of(false)
      })
    )

    return init$
  }

  /**
   * Emits false once the termination timeout has passed.
   * @returns {Observable<boolean>}
   */
  private setTimeoOut(): Observable<boolean> {
    return timer(this.TERMINATION_TIMEOUT).pipe(
      mapTo(false),
      catchError(() => {
        console.error(this.ERROR_TIMEOUT)
        return of(false)
      })
    )
  }

  /**
   * Passes the built auth config to the OAuth service.
   */
  private configureAuthConfig() {
    const authConfig = this.authConfigService.buildAuthConfig()
    this.oauthService.configure(authConfig)
  }
}
