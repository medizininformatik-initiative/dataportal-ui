import { FeasibilityQueryResultApiService } from '../../../Backend/Api/FeasibilityQueryResultApi.service'
import { ObfuscatedResultService } from './ObfuscatedResult.service'
import { of } from 'rxjs'
import { TestBed } from '@angular/core/testing'

describe('ObfuscatedResultService', () => {
  const api = { getDetailedObfuscatedResult: jest.fn() }
  let service: ObfuscatedResultService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: FeasibilityQueryResultApiService, useValue: api }],
    })
    service = TestBed.inject(ObfuscatedResultService)
  })

  it('turns a 200 body with only issues (#631) into an error', () => {
    const issues = [{ code: 'FEAS-10004', message: 'm', type: 'busy', severity: 'error' }]
    api.getDetailedObfuscatedResult.mockReturnValue(of({ issues }))
    let err
    service.getDetailedObfuscatedResult('1', 'q').subscribe({ error: (e) => (err = e) })
    expect(err).toEqual({ payload: issues })
  })

  it('maps a normal result without resultLines to an empty list', () => {
    api.getDetailedObfuscatedResult.mockReturnValue(of({ totalNumberOfPatients: 5, queryId: 1 }))
    let res
    service.getDetailedObfuscatedResult('1', 'q').subscribe((r) => (res = r))
    expect(res.getResultLines()).toEqual([])
  })
})
