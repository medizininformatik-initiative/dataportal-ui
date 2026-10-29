import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service'
import { CriterionBuilderHelperService } from './CriterionBuilderHelper.service'

@Injectable({
  providedIn: 'root',
})
export class LoadCriterionService {
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly criterionBuilderHelperService = inject(CriterionBuilderHelperService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Loads criteria based on the provided hashes.
   * @param {string[]} hashes
   * @returns {Observable<Criterion[]>}
   */
  public loadCriteria(hashes: string[]): Observable<Criterion[]> {
    const validHashes = hashes.filter((hash: string): hash is string => !!hash)
    return this.terminologyApiService
      .getCriteriaProfileData(validHashes)
      .pipe(map((data: CriteriaProfileData[]) => this.buildCriteriaFromProfileData(data)))
  }

  /**
   * Builds criteria from the provided profile data.
   * @param {CriteriaProfileData[]} criteriaProfileDatas
   * @returns {Criterion[]}
   */
  private buildCriteriaFromProfileData(criteriaProfileDatas: CriteriaProfileData[]): Criterion[] {
    return criteriaProfileDatas.map((data: CriteriaProfileData) =>
      this.criterionBuilderHelperService.setBuilderWithCriteriaProfileData(data).buildCriterion()
    )
  }
}
