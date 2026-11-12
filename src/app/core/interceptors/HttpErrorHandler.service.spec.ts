import { HttpContext, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http'
import { HttpErrorHandlerService } from './HttpErrorHandler.service'
import { IS_FEASIBILITY_REQUEST } from 'src/app/service/Backend/HttpContextToken'
import { TestBed } from '@angular/core/testing'

describe('HttpErrorHandlerService 429', () => {
  const issues = [{ code: 'FEAS-10003', message: 'm', type: 'busy', severity: 'error' }]
  let service: HttpErrorHandlerService

  beforeEach(() => {
    service = TestBed.inject(HttpErrorHandlerService)
  })

  const tooManyRequests = (headers: Record<string, string>) => {
    const request = new HttpRequest('GET', '/x', {
      context: new HttpContext().set(IS_FEASIBILITY_REQUEST, true),
    })
    const error = new HttpErrorResponse({
      status: 429,
      error: { issues },
      headers: new HttpHeaders(headers),
    })
    let thrown
    service.handleError(error, request).subscribe({ error: (e) => (thrown = e) })
    return thrown
  }

  it.each(['Retry-After', 'X-Rate-Limit-Retry-After-Seconds'])('reads %s', (name) => {
    expect(tooManyRequests({ [name]: '9' }).retryAfterSeconds).toBe(9)
  })

  it('leaves retryAfterSeconds undefined without header', () => {
    expect(tooManyRequests({}).retryAfterSeconds).toBeUndefined()
  })
})
