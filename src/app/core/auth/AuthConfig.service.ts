import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { AssetsPath } from '../assets/AssetsPath'
import { AuthConfig } from 'angular-oauth2-oidc'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AuthConfigService {
  private readonly appSettingsProvider = inject(AppSettingsProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Builds the OAuth authentication configuration
   * @returns Complete AuthConfig object for OAuth service
   */
  public buildAuthConfig(): AuthConfig {
    const baseUrl = this.appSettingsProvider.getAuthBaseUrl()
    const realm = this.appSettingsProvider.getAuthRealm()
    const clientId = this.appSettingsProvider.getAuthClientId()
    const redirectUri = this.buildRedirectUri()
    const silentRefreshUri = this.buildSilentRefreshUri()
    const issuer = this.getIssuerUrl(baseUrl, realm)
    if (!baseUrl || !realm || !clientId) {
      throw new Error(
        'Missing required authentication configuration. Check baseUrl, realm, and clientId.'
      )
    }

    return {
      preserveRequestedRoute: true,
      issuer,
      clientId,
      responseType: 'code',
      logoutUrl: `${issuer}/protocol/openid-connect/logout`,
      redirectUri,
      silentRefreshRedirectUri: silentRefreshUri,
      scope: 'openid profile email roles',
      useSilentRefresh: true,
      silentRefreshTimeout: 52000,
      timeoutFactor: 0.25,
      sessionChecksEnabled: true,
      clearHashAfterLogin: false,
      nonceStateSeparator: 'semicolon',
    }
  }

  /**
   * Builds the redirect URI for OAuth callback
   */
  private buildRedirectUri(): string {
    return `${window.location.origin}/home`
  }

  /**
   * Builds the silent refresh URI for token renewal
   */
  private buildSilentRefreshUri(): string {
    return `${window.location.origin}` + '/' + AssetsPath.SILENT_REFRESH_URL
  }

  /**
   * Gets the issuer URL for the current configuration
   */
  public getIssuerUrl(baseUrl: string, realm: string): string {
    return `${baseUrl}/realms/${realm}`
  }
}
