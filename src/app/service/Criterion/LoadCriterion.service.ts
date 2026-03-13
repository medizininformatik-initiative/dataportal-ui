import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriterionBuilderHelperService } from './CriterionBuilderHelper.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';

@Injectable({
  providedIn: 'root',
})
export class LoadCriterionService {
  constructor(
    private terminologyApiService: TerminologyApiService,
    private criterionBuilderHelperService: CriterionBuilderHelperService
  ) {}

  /**
   * Loads criteria based on the provided hashes.
   * @param hashes
   * @returns
   */
  public loadCriteria(hashes: string[]): Observable<Criterion[]> {
    const validHashes = hashes.filter((hash): hash is string => !!hash);
    return this.terminologyApiService
      .getCriteriaProfileData(validHashes)
      .pipe(map((data: CriteriaProfileData[]) => this.buildCriteriaFromProfileData(data)));
  }

  /**
   * Builds criteria from the provided profile data.
   * @param criteriaProfileDatas
   * @returns
   */
  private buildCriteriaFromProfileData(criteriaProfileDatas: CriteriaProfileData[]): Criterion[] {
    return criteriaProfileDatas.map((data) =>
      this.criterionBuilderHelperService.setBuilderWithCriteriaProfileData(data).buildCriterion()
    );
  }
}
