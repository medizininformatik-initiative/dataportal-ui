import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service'
import { CriterionBuilderHelperService } from './CriterionBuilderHelper.service'

@Injectable({
  providedIn: 'root',
})
export class LoadReferenceCriterionService {
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly criterionBuilderHelperService = inject(CriterionBuilderHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Loads reference criteria based on the provided hashes and parent ID.
   * @param {string[]} hashes
   * @param {string} parentId
   * @returns {Observable<ReferenceCriterion[]>}
   */
  public loadReferenceCriteria(hashes: string[], parentId: string): Observable<ReferenceCriterion[]> {
    const validHashes = hashes.filter((hash: string): hash is string => !!hash)
    return this.terminologyApiService.getCriteriaProfileData(validHashes).pipe(
      map((data: CriteriaProfileData[]) =>
        data.map((d: CriteriaProfileData) => {
          const builder = this.criterionBuilderHelperService.setBuilderWithCriteriaProfileData(d)
          builder.withParentId(parentId)
          return builder.buildReferenceCriterion()
        })
      )
    )
  }
}
