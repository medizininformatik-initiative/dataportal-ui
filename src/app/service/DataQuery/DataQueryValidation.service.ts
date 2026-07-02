import { combineLatest, map, Observable } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'
import { DataSelectionValidationService } from '../Validation/DataSelectionValidation.service'
import { FeasibilityQueryValidationService } from '../Criterion/Validation/FeasibilityQueryValidationService.service'
import { inject, Injectable } from '@angular/core'
import { ValidDataQuery } from 'src/app/model/Types/ValidDataQuery'

@Injectable({
  providedIn: 'root',
})
export class DataQueryValidationService {
  private feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)
  private dataSelectionValidationService = inject(DataSelectionValidationService)
  private readonly feasibility$ = toObservable(
    this.feasibilityQueryValidationService.isFeasibilityQueryValid
  )
  private readonly dataSelection$ = toObservable(this.dataSelectionValidationService.isValid)

  public validateDataQuery(): Observable<ValidDataQuery> {
    return this.combineFeasiblityQueryAndDataSelection(this.feasibility$, this.dataSelection$)
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
    )
  }
}
