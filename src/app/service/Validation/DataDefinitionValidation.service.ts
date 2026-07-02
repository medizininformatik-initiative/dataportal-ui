import { inject, Injectable } from '@angular/core'
import { DataSelectionValidationService } from './DataSelectionValidation.service'
import { FeasibilityQueryValidationService } from '../Criterion/Validation/FeasibilityQueryValidationService.service'

@Injectable({
  providedIn: 'root',
})
export class DataDefinitionValidationService {
  private readonly dataSelectionValidationService = inject(DataSelectionValidationService)
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  constructor() {}

  /**
   * Returns true if both the criterion and data selection are valid, false otherwise.
   * @returns {boolean}
   */
  public isDataDefinitionValid(): boolean {
    return this.isCriterionValid() && this.isDataSelectionValid()
  }

  /**
   * Returns true if the criterion is valid, false otherwise.
   * @returns {boolean}
   */
  private isCriterionValid(): boolean {
    return this.feasibilityQueryValidationService.isFeasibilityQueryValid()
  }

  /**
   * Returns true if the data selection is valid, false otherwise.
   * @returns {boolean}
   */
  private isDataSelectionValid(): boolean {
    return this.dataSelectionValidationService.isDataSelectionValid()
  }
}
