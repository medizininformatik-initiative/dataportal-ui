import { Injectable } from '@angular/core';
import { LoadReferenceCriterionService } from '../LoadReferenceCriterion.service';
import { Observable } from 'rxjs';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';

@Injectable({
  providedIn: 'root',
})
export class BuildReferenceCriterionService {
  constructor(private loadReferenceCriterionService: LoadReferenceCriterionService) {}

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
    return this.loadReferenceCriterionService.loadReferenceCriteria(hashes, parentId);
  }
}
