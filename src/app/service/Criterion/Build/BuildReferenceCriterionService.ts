import { Injectable, inject } from '@angular/core'
import { LoadReferenceCriterionService } from '../LoadReferenceCriterion.service'
import { Observable } from 'rxjs'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'

@Injectable({
  providedIn: 'root',
})
export class BuildReferenceCriterionService {
  private loadReferenceCriterionService = inject(LoadReferenceCriterionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates reference criteria based on the provided hashes and parent ID.
   * @param hashes
   * @param parentId
   * @returns
   */
  public buildReferenceCriteriaFromHashes(
    hashes: string[],
    parentId: string
  ): Observable<ReferenceCriterion[]> {
    return this.loadReferenceCriterionService.loadReferenceCriteria(hashes, parentId)
  }
}
