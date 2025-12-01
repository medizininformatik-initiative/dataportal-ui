import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriteriaProfileDataService } from '../CriteriaProfileData/CriteriaProfileData.service';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder';
import { CriterionBuilderHelperService } from './CriterionBuilderHelper.service';
import { finalize, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { SelectedTableItemsService } from '../SearchTermListItemService.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCriterionService {
  constructor(
    private criteriaProfileDataService: CriteriaProfileDataService,
    private criterionBuilderHelperService: CriterionBuilderHelperService,
    private listItemService: SelectedTableItemsService<CriteriaListEntry>
  ) {}

  public createReferenceCriteriaFromHashes(
    hashes: string[],
    parentId: string
  ): Observable<ReferenceCriterion[]> {
    return this.fetchCriteriaProfileDataFromHashes(true, hashes, parentId) as Observable<
      ReferenceCriterion[]
    >;
  }

  /**
   *
   * @param hashes
   * @param clearSelection
   * @returns
   */
  public createCriteriaFromHashes(
    hashes: string[],
    clearSelection: boolean = true
  ): Observable<Criterion[]> {
    return this.fetchCriteriaProfileDataFromHashes(clearSelection, hashes, undefined);
  }

  private fetchCriteriaProfileDataFromHashes(
    clearSelection: boolean,
    hashes: string[],
    parentId?: string
  ): Observable<AbstractCriterion[]> {
    const validHashes = this.filterValidHashes(hashes);
    return this.criteriaProfileDataService.getCriteriaProfileData(validHashes).pipe(
      map((criteriaProfileDatas: CriteriaProfileData[]) =>
        this.buildCriteriaFromProfileData(criteriaProfileDatas, parentId)
      ),
      finalize(() => {
        if (clearSelection) {
          this.listItemService.clearSelection();
        }
      })
    );
  }

  private filterValidHashes(hashes: string[]): string[] {
    return hashes.filter((hash): hash is string => !!hash);
  }

  private buildCriteriaFromProfileData(
    criteriaProfileDatas: CriteriaProfileData[],
    parentId?: string
  ): AbstractCriterion[] {
    return criteriaProfileDatas.map((criteriaProfileData: CriteriaProfileData) =>
      this.buildSingleCriterion(criteriaProfileData, parentId)
    );
  }

  private buildSingleCriterion(
    criteriaProfileData: CriteriaProfileData,
    parentId?: string
  ): AbstractCriterion {
    const builder =
      this.criterionBuilderHelperService.setBuilderWithCriteriaProfileData(criteriaProfileData);
    return parentId
      ? this.createReferenceCriterion(builder, parentId)
      : this.createCriterion(builder);
  }

  private createCriterion(builder: CriterionBuilder): Criterion {
    return builder.buildCriterion();
  }

  private createReferenceCriterion(
    builder: CriterionBuilder,
    parentId: string
  ): ReferenceCriterion {
    builder.withParentId(parentId);
    return builder.buildReferenceCriterion();
  }
}
