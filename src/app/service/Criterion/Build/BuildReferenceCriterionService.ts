import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { LoadReferenceCriterionService } from '../LoadReferenceCriterion.service'

@Injectable({
  providedIn: 'root',
})
export class BuildReferenceCriterionService {
  private readonly loadReferenceCriterionService = inject(LoadReferenceCriterionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates reference criteria based on the provided hashes and parent ID.
   * @param {string[]} hashes
   * @param {string} parentId
   * @returns {Observable<ReferenceCriterion[]>}
   */
  public buildReferenceCriteriaFromHashes(hashes: string[], parentId: string): Observable<ReferenceCriterion[]> {
    return this.loadReferenceCriterionService.loadReferenceCriteria(hashes, parentId)
  }
}
