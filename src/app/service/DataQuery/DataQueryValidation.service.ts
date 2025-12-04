import { combineLatest, map, Observable } from 'rxjs';
import { DataSelection } from 'src/app/model/DataSelection/DataSelection';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { FeasibilityQueryValidationService } from '../Criterion/FeasibilityQueryValidation.service';
import { Injectable } from '@angular/core';
import { ValidDataQuery } from 'src/app/model/Types/ValidDataQuery';

@Injectable({
  providedIn: 'root',
})
export class DataQueryValidationService {
  constructor(
    private dataSelectionProviderService: DataSelectionProviderService,
    private criterionValidationService: FeasibilityQueryValidationService
  ) {}

  public validateDataQuery(): Observable<ValidDataQuery> {
    const feasibility$ = this.criterionValidationService.getIsFeasibilityQueryValid();
    const dataSelection$ = this.hasValidDataSelection();
    return this.combineFeasiblityQueryAndDataSelection(feasibility$, dataSelection$);
  }

  private combineFeasiblityQueryAndDataSelection(
    feasibility$: Observable<boolean>,
    dataSelection$: Observable<boolean>
  ): Observable<ValidDataQuery> {
    return combineLatest([feasibility$, dataSelection$]).pipe(
      map(([feasibilityQuery, dataSelection]) => ({
        feasibilityQuery,
        dataSelection,
      }))
    );
  }

  private hasValidDataSelection(): Observable<boolean> {
    return this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((dataSelection) => this.isDataSelectionValid(dataSelection)));
  }

  private isDataSelectionValid(dataSelection: DataSelection): boolean {
    return !!dataSelection && dataSelection.getProfiles().length > 0;
  }
}
