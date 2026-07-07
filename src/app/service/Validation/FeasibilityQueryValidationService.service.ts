import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { computed, inject, Injectable } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from '../Provider/CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from '../Provider/FeasibilityQueryProvider.service'
import { FilterTypesService } from '../FilterTypes.service'
import { map } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

export interface FeasibilityValidationState {
  count: number
  isValid: boolean
  validatedCriterions: CriterionValidationState[]
  hasInclusionCriteria: boolean
}

export interface CriterionValidationState {
  criterionId: string
  isValid: boolean
  missingFilters: AbstractAttributeFilters[]
}

const INITIAL_STATE: FeasibilityValidationState = {
  validatedCriterions: [],
  hasInclusionCriteria: false,
  count: 0,
  isValid: false,
}
@Injectable({ providedIn: 'root' })
export class FeasibilityQueryValidationService {
  private readonly filterTypeService = inject(FilterTypesService)
  private readonly feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private readonly criterionProvider = inject(CriterionProviderService)

  private readonly activeFeasibilityQuery = toSignal<FeasibilityQuery | null>(
    this.feasibilityQueryService.getActiveFeasibilityQuery().pipe(map((query) => query ?? null)),
    { initialValue: null }
  )

  readonly criteria = toSignal(this.criterionProvider.getAll(), {
    initialValue: [],
  })

  public readonly validationState = computed<FeasibilityValidationState>(() => {
    const feasibilityQuery = this.activeFeasibilityQuery()
    const criteria = this.criteria()
    console.log(criteria)
    console.log(feasibilityQuery)
    if (!feasibilityQuery) {
      return INITIAL_STATE
    }

    return this.buildValidationState(feasibilityQuery)
  })

  /**
   * Iterates through all criteria in the feasibility query and checks if any required filters are missing and if Inclusion criteria are present.
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {FeasibilityValidationState}
   */
  private buildValidationState(feasibilityQuery: FeasibilityQuery): FeasibilityValidationState {
    const allCriterionIds = this.flattenCriteria(feasibilityQuery)

    const validatedCriterions = allCriterionIds.map((id) => {
      const criterion = this.criterionProvider.getOne(id)
      const criterionValidationState = this.buildCriterionValidationState(criterion)
      return criterion
        ? criterionValidationState
        : { criterionId: id, isValid: false, missingFilters: [] }
    })
    return {
      hasInclusionCriteria: feasibilityQuery.getInclusionCriteria().length > 0,
      count: allCriterionIds.length,
      validatedCriterions: validatedCriterions,
      isValid:
        validatedCriterions.every((c) => c.isValid) &&
        feasibilityQuery.getInclusionCriteria().length > 0,
    }
  }

  private buildCriterionValidationState(criterion: Criterion): CriterionValidationState {
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
   * Determines if a filter is required for a given criterion.
   * @param {Criterion} criterion
   * @returns {boolean}
   */
  public isRequiredFilterSet(criterion: Criterion): boolean {
    return (
      this.collectMissingFilters(criterion.getValueFilters()).length > 0 ||
      this.collectMissingFilters(criterion.getAttributeFilters()).length > 0
    )
  }

  /**
   * Checks if any required filters are unset in the given array of filters.
   * @param {AbstractAttributeFilters[]} filters
   * @returns {boolean}
   */
  private collectMissingFilters(filters: AbstractAttributeFilters[]): AbstractAttributeFilters[] {
    return filters.filter(
      (filter: AbstractAttributeFilters) =>
        !filter.getOptional() &&
        (filter.getConcept()?.getSelectedConcepts().length === 0 ||
          this.filterTypeService.isQuantityNotSet(filter.getQuantity()?.getType()))
    )
  }

  /**
   * Flattens the criteria from the feasibility query into a single array of criterion IDs.
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {string[]}
   */
  private flattenCriteria(feasibilityQuery: FeasibilityQuery): string[] {
    const flatten = (groups: string[][]): string[] =>
      groups.reduce<string[]>((acc, group) => [...acc, ...group], [])

    return [
      ...flatten(feasibilityQuery.getInclusionCriteria()),
      ...flatten(feasibilityQuery.getExclusionCriteria()),
    ]
  }
}
