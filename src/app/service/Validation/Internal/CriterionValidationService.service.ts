import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { FilterTypesService } from 'src/app/service/FilterTypes.service'
import { inject, Injectable } from '@angular/core'

export interface CriterionValidationState {
  criterionId: string
  isValid: boolean
  missingFilters: AbstractAttributeFilters[]
}

@Injectable({ providedIn: 'root' })
export class CriterionValidationService {
  private readonly filterTypeService = inject(FilterTypesService)
  private readonly criterionProvider = inject(CriterionProviderService)

  /**
   * Validates multiple criteria by their IDs.
   * @param criterionIds - An array of criterion IDs to validate.
   * @returns An array of CriterionValidationState objects representing the validation results.
   */
  public validateMany(criterionIds: string[]): CriterionValidationState[] {
    return criterionIds.map((id) => {
      const criterion = this.criterionProvider.getOne(id)
      return criterion
        ? this.validate(criterion)
        : { criterionId: id, isValid: false, missingFilters: [] }
    })
  }

  /**
   * Validates a single criterion.
   * @param {Criterion} criterion - The criterion to validate.
   * @returns {CriterionValidationState} The validation state of the criterion.
   */
  public validate(criterion: Criterion): CriterionValidationState {
    const missingFilters = [
      ...this.collectMissingFilters(criterion.getValueFilters()),
      ...this.collectMissingFilters(criterion.getAttributeFilters()),
    ]
    return {
      criterionId: criterion.getId(),
      isValid: missingFilters.length === 0,
      missingFilters,
    }
  }

  /**
   * Checks if the required filters are set for a given criterion.
   * @param {Criterion} criterion - The criterion to check.
   * @returns {boolean} True if the required filters are set, false otherwise.
   */
  public isRequiredFilterSet(criterion: Criterion): boolean {
    return (
      this.collectMissingFilters(criterion.getValueFilters()).length > 0 ||
      this.collectMissingFilters(criterion.getAttributeFilters()).length > 0
    )
  }

  /**
   * Collects the missing filters from a given array of filters.
   * @param {AbstractAttributeFilters[]} filters - The array of filters to check.
   * @returns {AbstractAttributeFilters[]} An array of missing filters.
   */
  private collectMissingFilters(filters: AbstractAttributeFilters[]): AbstractAttributeFilters[] {
    return filters.filter(
      (filter) =>
        !filter.getOptional() &&
        (filter.getConcept()?.getSelectedConcepts().length === 0 ||
          this.filterTypeService.isQuantityNotSet(filter.getQuantity()?.getType()))
    )
  }
}
