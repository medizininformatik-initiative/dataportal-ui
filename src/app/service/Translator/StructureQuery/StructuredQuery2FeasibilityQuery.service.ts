import { ConsentService } from '../../Consent/Consent.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { forkJoin, map, Observable, of } from 'rxjs'
import { Injectable, inject } from '@angular/core'
import { StructuredQuery2UIQueryTranslatorService } from './StructuredQuery2UIQueryTranslator.service'
import { StructuredQueryData } from 'src/app/model/Interface/StructuredQueryData'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class StructuredQuery2FeasibilityQueryService {
  private structuredQuery2UIQueryTranslatorService = inject(
    StructuredQuery2UIQueryTranslatorService
  )
  private consentService = inject(ConsentService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translate(structuredQuery: StructuredQueryData | any): Observable<FeasibilityQuery> {
    const feasibilityQuery = new FeasibilityQuery(uuidv4(), structuredQuery?.display ?? '')
    if (!TypeGuard.isStructuredQueryData(structuredQuery)) {
      console.warn('ERROR: No inclusion criteria')
      return of(feasibilityQuery)
    }
    const inclusion$ = this.getInclusionObservable(structuredQuery)
    const exclusion$ = this.getExclusionObservable(structuredQuery)
    return this.combineCriteria(inclusion$, exclusion$, feasibilityQuery)
  }

  private getInclusionObservable(structuredQuery: StructuredQueryData): Observable<string[][]> {
    return this.structuredQuery2UIQueryTranslatorService.translate(
      structuredQuery.inclusionCriteria
    )
  }

  private getExclusionObservable(
    structuredQuery: StructuredQueryData
  ): Observable<string[][] | null> {
    return this.hasValidExclusionCriteria(structuredQuery)
      ? this.structuredQuery2UIQueryTranslatorService.translate(structuredQuery.exclusionCriteria)
      : of(null)
  }

  private combineCriteria(
    inclusion$: Observable<string[][]>,
    exclusion$: Observable<string[][] | null>,
    feasibilityQuery: FeasibilityQuery
  ): Observable<FeasibilityQuery> {
    return forkJoin([inclusion$, exclusion$]).pipe(
      map(([inclusion, exclusion]) => {
        feasibilityQuery.setInclusionCriteria(inclusion)
        feasibilityQuery.setConsent(this.consentService.getConsent())
        if (exclusion) {
          feasibilityQuery.setExclusionCriteria(exclusion)
        }
        return feasibilityQuery
      })
    )
  }

  private hasValidExclusionCriteria(structuredQuery: StructuredQueryData): boolean {
    return (
      Array.isArray(structuredQuery.exclusionCriteria) &&
      structuredQuery.exclusionCriteria.some(
        (criteria) => Array.isArray(criteria) && criteria.length > 0
      )
    )
  }
}
