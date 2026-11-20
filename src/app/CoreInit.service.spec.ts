import { AppConfigService } from './config/AppConfig.service'
import { CoreInitService } from './CoreInit.service'
import { DataportalConfigService } from './config/DataportalConfig.service'
import { Observable, of, throwError } from 'rxjs'
import { OAuthInitService } from './core/auth/OAuthInit.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { OAuthService } from 'angular-oauth2-oidc'
import { TestBed } from '@angular/core/testing'

describe('CoreInitService', () => {
  const loadDataportalConfig = jest.fn()

  const setup = (loggedIn: boolean): Observable<unknown> => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OAuthService, useValue: {} },
        { provide: AppConfigService, useValue: { loadAppConfig: () => of({}) } },
        { provide: OAuthInitService, useValue: { initOAuth: () => of(loggedIn) } },
        { provide: DataportalConfigService, useValue: { loadDataportalConfig } },
      ],
    })
    return TestBed.inject(CoreInitService).init()
  }

  beforeEach(() => jest.clearAllMocks())

  it('stops before any backend call when the login redirect has started', () => {
    const next = jest.fn()
    const error = jest.fn()

    setup(false).subscribe({ next, error })

    expect(loadDataportalConfig).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('names the failed stage and keeps the message of an HTTP error object', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    loadDataportalConfig.mockReturnValue(
      throwError(() => ({
        type: 'GENERIC_ERROR',
        payload: [{ message: 'Http failure response for /.settings: 401 Unauthorized' }],
        url: '/.settings',
      }))
    )
    const error = jest.fn()

    setup(true).subscribe({ error })

    expect(error).toHaveBeenCalledWith(
      new Error(
        'Loading the dataportal settings failed: Http failure response for /.settings: 401 Unauthorized'
      )
    )
  })
})
