import { AuthTokenInterceptor } from './AuthToken.interceptor'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { OAuthService } from 'angular-oauth2-oidc'
import { TestBed } from '@angular/core/testing'

describe('AuthTokenInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  const oauthService = { getAccessToken: jest.fn(), hasValidAccessToken: jest.fn() }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        { provide: OAuthService, useValue: oauthService },
      ],
    })
    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  const authHeaderFor = (url: string): string | null => {
    http.get(url).subscribe()
    return httpMock.expectOne(url).request.headers.get('Authorization')
  }

  it('adds the bearer token when the token is valid', () => {
    oauthService.getAccessToken.mockReturnValue('abc')
    oauthService.hasValidAccessToken.mockReturnValue(true)
    expect(authHeaderFor('/backend/x')).toBe('Bearer abc')
  })

  it('sends no Authorization header before login (no token)', () => {
    oauthService.getAccessToken.mockReturnValue(null)
    oauthService.hasValidAccessToken.mockReturnValue(false)
    expect(authHeaderFor('/backend/.settings')).toBeNull()
  })

  it('sends no Authorization header when the token is expired', () => {
    oauthService.getAccessToken.mockReturnValue('expired')
    oauthService.hasValidAccessToken.mockReturnValue(false)
    expect(authHeaderFor('/backend/x')).toBeNull()
  })

  it('does not add the token to asset requests', () => {
    oauthService.getAccessToken.mockReturnValue('abc')
    oauthService.hasValidAccessToken.mockReturnValue(true)
    expect(authHeaderFor('assets/i18n/de.json')).toBeNull()
  })
})
