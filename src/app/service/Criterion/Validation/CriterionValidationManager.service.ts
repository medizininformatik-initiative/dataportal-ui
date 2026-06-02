import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { Injectable, inject } from '@angular/core'
import { InvalidCriteriaService } from './InvalidCriteria.service'
import { MissingCriteriaService } from './MissingCriteria.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CriterionValidationManagerService {
  private missingCriteriaService = inject(MissingCriteriaService)
  private invalidCriteriaService = inject(InvalidCriteriaService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getMissingRequiredFilterCriteria(
    feasibilityQuery: FeasibilityQuery
  ): Observable<string[]> {
    return this.missingCriteriaService.getMissingCriteria(feasibilityQuery)
  }

  public getInvalidCriteria(feasibilityQuery: FeasibilityQuery): string[] {
    return this.invalidCriteriaService.getInvalidCriteriaList(feasibilityQuery)
  }

  public isInclusionSet(feasibilityQuery: FeasibilityQuery): boolean {
    return feasibilityQuery.getInclusionCriteria().length > 0
  }

  /**
   * @todo check if condition is correct
   * @param feasibilityQuery
   * @returns boolean
   */
  public isFeasibilityQuerySet(feasibilityQuery: FeasibilityQuery): boolean {
    return (
      this.isInclusionSet(feasibilityQuery) || feasibilityQuery.getExclusionCriteria().length > 0
    )
  }
}
