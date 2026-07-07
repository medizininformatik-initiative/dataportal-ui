import { computed, inject, Injectable } from '@angular/core'
import {
  CriterionValidationService,
  CriterionValidationState,
} from './CriterionValidationService.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { map } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

export interface FeasibilityQueryValidationState {
  criterionCount: number
  isValid: boolean
  criterionValidationStates: CriterionValidationState[]
  hasInclusionCriteria: boolean
}

const INITIAL_STATE: FeasibilityQueryValidationState = {
  criterionValidationStates: [],
  hasInclusionCriteria: false,
  criterionCount: 0,
  isValid: false,
}

@Injectable({ providedIn: 'root' })
export class FeasibilityQueryValidationService {
  private readonly criterionValidationService = inject(CriterionValidationService)
  private readonly feasibilityQueryService = inject(FeasibilityQueryProviderService)

  /**
   * @returns {FeasibilityQueryValidationState} The validation state of the active feasibility query.
   */
  private readonly activeFeasibilityQuery = toSignal<FeasibilityQuery | null>(
    this.feasibilityQueryService.getActiveFeasibilityQuery().pipe(map((query) => query ?? null)),
    { initialValue: null, equal: () => false }
  )

  /**
   * @returns {FeasibilityQueryValidationState} The validation state of the active feasibility query.
   */
  readonly validationState = computed<FeasibilityQueryValidationState>(() => {
    const feasibilityQuery = this.activeFeasibilityQuery()
    return feasibilityQuery ? this.buildValidationState(feasibilityQuery) : INITIAL_STATE
  })

  /**
   * Returns true if the feasibility query is valid, false otherwise.
   * @returns {boolean}
   */
  readonly isFeasibilityQueryValid = computed<boolean>(() => this.validationState().isValid)

  /**
   * Builds the validation state for a given feasibility query.
   * @param {FeasibilityQuery} feasibilityQuery - The feasibility query to validate.
   * @returns {FeasibilityQueryValidationState} The validation state of the feasibility query.
   */
  private buildValidationState(
    feasibilityQuery: FeasibilityQuery
  ): FeasibilityQueryValidationState {
    const allCriterionIds = this.flattenCriteria(feasibilityQuery)
    const criterionValidationStates = this.criterionValidationService.validateMany(allCriterionIds)
    const inclusionCriteriaCount = feasibilityQuery.getInclusionCriteria().length
    return {
      hasInclusionCriteria: inclusionCriteriaCount > 0,
      criterionCount: allCriterionIds.length,
      criterionValidationStates,
      isValid: criterionValidationStates.every((c) => c.isValid) && inclusionCriteriaCount > 0,
    }
  }

  /**
   * Flattens the criteria from a given feasibility query into a single array of criterion IDs.
   * @param {FeasibilityQuery} feasibilityQuery - The feasibility query to flatten.
   * @returns {string[]} An array of criterion IDs.
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
