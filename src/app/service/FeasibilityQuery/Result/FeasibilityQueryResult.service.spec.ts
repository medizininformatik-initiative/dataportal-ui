import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryResultService } from './FeasibilityQueryResult.service'
import { ObfuscatedResultService } from './Obfuscate/ObfuscatedResult.service'
import { ObfuscatedResultRateLimitService } from './Obfuscate/ObfuscatedResultRateLimit.service'
import { of, throwError } from 'rxjs'
import { PollingManagerService } from './Polling/PollingManager.service'
import { ResultProviderService } from '../../Provider/ResultProvider.service'
import { TestBed } from '@angular/core/testing'

describe('FeasibilityQueryResultService detail errors', () => {
  const obfuscated = { getDetailedObfuscatedResult: jest.fn() }
  const query = {
    getId: () => 'q1',
    inclusion: [['a']] as unknown[],
    getInclusionCriteria() {
      return this.inclusion
    },
    getExclusionCriteria: () => [] as unknown[],
  }
  let service: FeasibilityQueryResultService

  beforeEach(() => {
    obfuscated.getDetailedObfuscatedResult.mockReset()
    TestBed.configureTestingModule({
      providers: [
        { provide: ObfuscatedResultService, useValue: obfuscated },
        { provide: PollingManagerService, useValue: {} },
        { provide: ResultProviderService, useValue: { getOne: () => undefined, setOne: () => {} } },
        { provide: ObfuscatedResultRateLimitService, useValue: { refreshRateLimit: () => {} } },
        {
          provide: FeasibilityQueryProviderService,
          useValue: { getActiveFeasibilityQuery: () => of(query) },
        },
      ],
    })
    service = TestBed.inject(FeasibilityQueryResultService)
  })

  it('maps the issue code and does not call the backend again for the same result', () => {
    obfuscated.getDetailedObfuscatedResult.mockReturnValue(
      throwError(() => ({ type: 'FEASIBILITY_ERROR', payload: [{ code: 'FEAS-10004' }] }))
    )
    const codes: string[] = []
    for (let i = 0; i < 3; i++) {
      service.getDetailedObfuscatedResult('r1').subscribe({ error: (e) => codes.push(e.code) })
    }
    expect(codes).toEqual(['FEAS-10004', 'FEAS-10004', 'FEAS-10004'])
    expect(obfuscated.getDetailedObfuscatedResult).toHaveBeenCalledTimes(1)
  })

  it('keeps the retry-after seconds and allows a new call once they passed', () => {
    jest.useFakeTimers().setSystemTime(0)
    obfuscated.getDetailedObfuscatedResult.mockReturnValue(
      throwError(() => ({ payload: [{ code: 'FEAS-10003' }], retryAfterSeconds: 9 }))
    )
    let err
    service.getDetailedObfuscatedResult('r3').subscribe({ error: (e) => (err = e) })
    expect(err.retryAfterSeconds).toBe(9)
    service.getDetailedObfuscatedResult('r3').subscribe({ error: () => {} })
    expect(obfuscated.getDetailedObfuscatedResult).toHaveBeenCalledTimes(1)
    jest.setSystemTime(10_000)
    service.getDetailedObfuscatedResult('r3').subscribe({ error: () => {} })
    expect(obfuscated.getDetailedObfuscatedResult).toHaveBeenCalledTimes(2)
    jest.useRealTimers()
  })

  it('counts the send block down after a 429 on the query request', () => {
    jest.useFakeTimers()
    const polling = TestBed.inject(PollingManagerService) as any
    polling.getPollingResult = () => throwError(() => ({ retryAfterSeconds: 3 }))
    service.doSendQueryRequest().subscribe({ error: () => {} })
    expect(service.sendBlockedSeconds()).toBe(3)
    jest.advanceTimersByTime(2000)
    expect(service.sendBlockedSeconds()).toBe(1)
    jest.advanceTimersByTime(1000)
    expect(service.sendBlockedSeconds()).toBe(0)
    jest.advanceTimersByTime(5000)
    expect(service.sendBlockedSeconds()).toBe(0)
    jest.useRealTimers()
  })

  it('falls back to RESULT_FAILED for unknown errors', () => {
    obfuscated.getDetailedObfuscatedResult.mockReturnValue(throwError(() => new Error('x')))
    let code
    service.getDetailedObfuscatedResult('r2').subscribe({ error: (e) => (code = e.code) })
    expect(code).toBe('RESULT_FAILED')
  })
})
