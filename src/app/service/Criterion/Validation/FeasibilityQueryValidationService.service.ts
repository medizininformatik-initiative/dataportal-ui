import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { computed, inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FilterTypesService } from '../../FilterTypes.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { map } from 'rxjs'

interface ValidationState {
  criterionIdsWithMissingFilters: string[]
  hasInclusionCriteria: boolean
}

const INITIAL_STATE: ValidationState = {
  criterionIdsWithMissingFilters: [],
  hasInclusionCriteria: false,
}
@Injectable({ providedIn: 'root' })
export class FeasibilityQueryValidationService {
  private readonly criterionService = inject(CriterionProviderService)
  private readonly filterTypeService = inject(FilterTypesService)
  private readonly feasibilityQueryService = inject(FeasibilityQueryProviderService)
  private criterionProvider = inject(CriterionProviderService)

  private readonly activeFeasibilityQuery = toSignal<FeasibilityQuery | null>(
    this.feasibilityQueryService.getActiveFeasibilityQuery().pipe(map((query) => query ?? null)),
    { initialValue: null }
  )

  readonly criteria = toSignal(this.criterionProvider.getAll(), {
    initialValue: [],
  })

  private readonly validationState = computed<ValidationState>(() => {
    const feasibilityQuery = this.activeFeasibilityQuery()
    const criteria = this.criteria()

    if (!feasibilityQuery) return INITIAL_STATE
    return this.buildValidationState(feasibilityQuery, criteria)
  })

  public readonly isFeasibilityQueryValid = computed<boolean>(() =>
    this.isStateValid(this.validationState())
  )

  /**
   * Iterates through all criteria in the feasibility query and checks if any required filters are missing and if Inclusion criteria are present.
   * @param {FeasibilityQuery} feasibilityQuery
   * @returns {ValidationState}
   */
  private buildValidationState(
    feasibilityQuery: FeasibilityQuery,
    criteria: Criterion[]
  ): ValidationState {
    const criteriaById = new Map(criteria.map((c) => [c.getId(), c]))

    const allCriteria = this.flattenCriteria(feasibilityQuery)

    return {
      criterionIdsWithMissingFilters: allCriteria.filter((id) => {
        const criterion = criteriaById.get(id)
        return criterion ? this.isFilterRequired(criterion) : true
      }),
      hasInclusionCriteria: feasibilityQuery.getInclusionCriteria().length > 0,
    }
  }

  /**
   * Checks the validity of the current validation state.
   */
  private isStateValid(state: ValidationState): boolean {
    return state.hasInclusionCriteria && state.criterionIdsWithMissingFilters.length === 0
  }

  /**
   * Resets the validation state to its initial state.
   * @deprecated State is now derived reactively from activeFeasibilityQuery.
   * Clearing the query via FeasibilityQueryProviderService automatically resets the state.
   */
  public resetValidation(): void {}

  /**
   * Determines if a filter is required for a given criterion.
   * @param {Criterion} criterion
   * @returns {boolean}
   */
  public isFilterRequired(criterion: Criterion): boolean {
    const result =
      this.hasRequiredUnsetFilters(criterion.getValueFilters()) ||
      this.hasRequiredUnsetFilters(criterion.getAttributeFilters())

    //criterion.setIsRequiredFilterSet(!result)
    return result
  }

  /**
   * Checks if any required filters are unset in the given array of filters.
   * @param {AbstractAttributeFilters[]} filters
   * @returns {boolean}
   */
  private hasRequiredUnsetFilters(filters: AbstractAttributeFilters[]): boolean {
    return filters.some(
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
