import { inject, Injectable } from '@angular/core'
import {
  DataSelectionValidationService,
  ValidationContext,
} from './DataSelectionValidation.service'
import {
  FeasibilityQueryValidationService,
  ValidationState,
} from '../Criterion/Validation/FeasibilityQueryValidationService.service'

export interface DataDefinitionValidationStatus {
  dataSelectionValidationState: ValidationContext[]
  feasibilityQueryValidationState: ValidationState
  isDataDefinitionValid: boolean
}
@Injectable({
  providedIn: 'root',
})
export class DataDefinitionValidationService {
  private readonly dataSelectionValidationService = inject(DataSelectionValidationService)
  private readonly feasibilityQueryValidationService = inject(FeasibilityQueryValidationService)

  constructor() {}

  /**
   *
   * @returns {}
   */
  public getDataDefinitionValidationStatus(): DataDefinitionValidationStatus {
    const dataSelectionValidationState = this.dataSelectionValidationService.validationContexts()
    const feasibilityQueryValidationState = this.feasibilityQueryValidationService.validationState()
    return {
      dataSelectionValidationState,
      feasibilityQueryValidationState,
      isDataDefinitionValid: this.isDataDefinitionValid(),
    }
  }

  /**
   * Returns true if both the feasibility query and data selection are valid, false otherwise.
   * @returns {boolean}
   */
  public isDataDefinitionValid(): boolean {
    return this.isFeasibilityQueryValid() && this.isDataSelectionValid()
  }

  /**
   * Returns true if the feasibility query is valid, false otherwise.
   * @returns {boolean}
   */
  private isFeasibilityQueryValid(): boolean {
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
