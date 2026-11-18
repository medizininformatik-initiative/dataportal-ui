import { AuthConfigService } from './AuthConfig.service'
import { firstValueFrom } from 'rxjs'
import { OAuthInitService } from './OAuthInit.service'
import { OAuthService } from 'angular-oauth2-oidc'
import { TestBed } from '@angular/core/testing'

describe('OAuthInitService', () => {
  let service: OAuthInitService
  const oauthService = {
    configure: jest.fn(),
    loadDiscoveryDocumentAndLogin: jest.fn(),
    setupAutomaticSilentRefresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    TestBed.configureTestingModule({
      providers: [
        { provide: OAuthService, useValue: oauthService },
        { provide: AuthConfigService, useValue: { buildAuthConfig: () => ({}) } },
      ],
    })
    service = TestBed.inject(OAuthInitService)
  })

  it('returns true and starts silent refresh when logged in', async () => {
    oauthService.loadDiscoveryDocumentAndLogin.mockResolvedValue(true)
    await expect(firstValueFrom(service.initOAuth())).resolves.toBe(true)
    expect(oauthService.setupAutomaticSilentRefresh).toHaveBeenCalled()
  })

  it('returns false when the login redirect has started', async () => {
    oauthService.loadDiscoveryDocumentAndLogin.mockResolvedValue(false)
    await expect(firstValueFrom(service.initOAuth())).resolves.toBe(false)
    expect(oauthService.setupAutomaticSilentRefresh).not.toHaveBeenCalled()
  })

  it('fails when the discovery document cannot be loaded', async () => {
    oauthService.loadDiscoveryDocumentAndLogin.mockRejectedValue(new Error('discovery failed'))
    await expect(firstValueFrom(service.initOAuth())).rejects.toThrow('discovery failed')
  })

  it('fails when the login does not answer in time', async () => {
    jest.useFakeTimers()
    oauthService.loadDiscoveryDocumentAndLogin.mockReturnValue(new Promise(() => {}))
    const result = firstValueFrom(service.initOAuth())
    jest.advanceTimersByTime(20_000)
    await expect(result).rejects.toThrow('No answer from the login server after 20000 ms')
    jest.useRealTimers()
  })
})
