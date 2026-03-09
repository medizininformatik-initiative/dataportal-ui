import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriterionBuilderHelperService } from './CriterionBuilderHelper.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service';

@Injectable({
  providedIn: 'root',
})
export class LoadReferenceCriterionService {
  constructor(
    private terminologyApiService: TerminologyApiService,
    private criterionBuilderHelperService: CriterionBuilderHelperService
  ) {}

  /**
   * Loads reference criteria based on the provided hashes and parent ID.
   * @param hashes
   * @param parentId
   * @returns
   */
  public loadReferenceCriteria(
    hashes: string[],
    parentId: string
  ): Observable<ReferenceCriterion[]> {
    const validHashes = hashes.filter((hash): hash is string => !!hash);
    return this.terminologyApiService.getCriteriaProfileData(validHashes).pipe(
      map((data: CriteriaProfileData[]) =>
        data.map((d) => {
          const builder = this.criterionBuilderHelperService.setBuilderWithCriteriaProfileData(d);
          builder.withParentId(parentId);
          return builder.buildReferenceCriterion();
        })
      )
    );
  }
}
