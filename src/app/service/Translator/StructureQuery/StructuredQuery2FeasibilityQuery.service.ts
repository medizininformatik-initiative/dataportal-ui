import { Injectable, inject } from '@angular/core'
import { forkJoin, map, Observable, of } from 'rxjs'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { StructuredQueryData } from 'src/app/model/Interface/StructuredQueryData'
import { v4 as uuidv4 } from 'uuid'
import { ConsentService } from '../../Consent/Consent.service'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { StructuredQuery2UIQueryTranslatorService } from './StructuredQuery2UIQueryTranslator.service'

@Injectable({
  providedIn: 'root',
})
export class StructuredQuery2FeasibilityQueryService {
  private readonly structuredQuery2UIQueryTranslatorService = inject(StructuredQuery2UIQueryTranslatorService)
  private readonly consentService = inject(ConsentService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Translates a structured query to a feasibility query.
   * @param {StructuredQueryData | any} structuredQuery
   * @returns {Observable<FeasibilityQuery>}
   */
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

  /**
   * Translates the inclusion criteria.
   * @param {StructuredQueryData} structuredQuery
   * @returns {Observable<string[][]>}
   */
  private getInclusionObservable(structuredQuery: StructuredQueryData): Observable<string[][]> {
    return this.structuredQuery2UIQueryTranslatorService.translate(structuredQuery.inclusionCriteria)
  }

  /**
   * Translates the exclusion criteria, or emits null if there are none.
   * @param {StructuredQueryData} structuredQuery
   * @returns {Observable<string[][] | null>}
   */
  private getExclusionObservable(structuredQuery: StructuredQueryData): Observable<string[][] | null> {
    return this.hasValidExclusionCriteria(structuredQuery)
      ? this.structuredQuery2UIQueryTranslatorService.translate(structuredQuery.exclusionCriteria)
      : of(null)
  }

  /**
   * Sets the translated criteria on the feasibility query.
   * @param {Observable<string[][]>} inclusion$
   * @param {Observable<string[][] | null>} exclusion$
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {Observable<FeasibilityQuery>}
   */
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

  /**
   * Checks whether the structured query has exclusion criteria.
   * @param {StructuredQueryData} structuredQuery
   * @returns {boolean}
   */
  private hasValidExclusionCriteria(structuredQuery: StructuredQueryData): boolean {
    return (
      Array.isArray(structuredQuery.exclusionCriteria) &&
      structuredQuery.exclusionCriteria.some((criteria) => Array.isArray(criteria) && criteria.length > 0)
    )
  }
}
