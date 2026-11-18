import { AuthConfigService } from './AuthConfig.service'
import { from, Observable, race, timer } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { OAuthService } from 'angular-oauth2-oidc'

@Injectable({
  providedIn: 'root',
})
export class OAuthInitService {
  private oauthService = inject(OAuthService)
  private authConfigService = inject(AuthConfigService)

  private readonly TERMINATION_TIMEOUT = 20_000

  private readonly ERROR_TIMEOUT = `No answer from the login server after ${this.TERMINATION_TIMEOUT} ms`

  /**
   * @returns {Observable<boolean>} true when logged in; false when the redirect to the login page has started
   */
  public initOAuth(): Observable<boolean> {
    this.configureAuthConfig()
    const timeout$ = this.createTimeout()
    const login$ = this.startOAuthLogin()
    return race([login$, timeout$])
  }

  /**
   * Loads the discovery document and logs in, or starts the redirect to the login page.
   * @returns {Observable<boolean>}
   */
  private startOAuthLogin(): Observable<boolean> {
    const init$ = from(
      this.oauthService.loadDiscoveryDocumentAndLogin().then((loggedIn) => {
        if (loggedIn) {
          this.oauthService.setupAutomaticSilentRefresh()
        }
        return loggedIn
      })
    )

    return init$
  }

  /**
   * Fails after TERMINATION_TIMEOUT ms.
   * @returns {Observable<boolean>}
   */
  private createTimeout(): Observable<boolean> {
    return timer(this.TERMINATION_TIMEOUT).pipe(
      map(() => {
        throw new Error(this.ERROR_TIMEOUT)
      })
    )
  }

  private configureAuthConfig(): void {
    const authConfig = this.authConfigService.buildAuthConfig()
    this.oauthService.configure(authConfig)
  }
}
