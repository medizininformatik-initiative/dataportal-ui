import { Injectable, inject } from '@angular/core'
import { map, Observable, take } from 'rxjs'
import { CohortTranslationError } from 'src/app/core/model/CohortTranslationError'
import { CCDLCohortDefinition } from 'src/app/model/CohortDefinition/CCDLCohortDefinition'
import { CCDLCriterion } from 'src/app/model/CohortDefinition/CCDLCriterion'
import {
  CCDLAttributeFilter,
  CCDLConceptFilter,
  CCDLQuantityComparatorFilter,
  CCDLQuantityRangeFilter,
  CCDLReferenceAttributeFilter,
  CCDLComparator,
  CCDLUnit,
  CCDLValueFilter,
} from 'src/app/model/CohortDefinition/CCDLFilters'
import { CCDLReferencedCriterion } from 'src/app/model/CohortDefinition/CCDLFilters'
import { CCDLTermCode } from 'src/app/model/CohortDefinition/CCDLTermCode'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { isNonEmpty, NonEmptyArray } from 'src/app/shared/types/NonEmptyArray'
import { ConceptFilter } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { Criterion } from '../../../model/FeasibilityQuery/Criterion/Criterion'
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery'
import { TerminologyCode } from '../../../model/Terminology/TerminologyCode'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service'
import {
  FeasibilityQueryValidationService,
  FeasibilityQueryValidationState,
} from '../../Validation/Internal/FeasibilityQueryValidationService.service'
import { TimeRestrictionTranslationService } from '../Shared/TimeRestrictionTranslation.service'

const VERSION = 'http://to_be_decided.com/draft-1/schema#'

/** `Omit` that fails to compile when the key does not exist on `T`. */
type StrictOmit<T, K extends keyof T> = Omit<T, K>

/** `ge`, `le`, `ne` and between are not producible by the editor and stay out of the output. */
const COMPARATORS: Partial<Record<QuantityComparisonOption, CCDLComparator>> = {
  [QuantityComparisonOption.EQUAL]: 'eq',
  [QuantityComparisonOption.LESS_THAN]: 'lt',
  [QuantityComparisonOption.GREATER_THAN]: 'gt',
}

const termCode = (code: TerminologyCode): CCDLTermCode => ({
  code: code.getCode(),
  display: code.getDisplay(),
  system: code.getSystem(),
  ...(code.getVersion() != null && { version: code.getVersion() }),
})

const unit = (quantityUnit: QuantityUnit): CCDLUnit => ({
  code: quantityUnit.getCode(),
  display: quantityUnit.getDisplay(),
})

const nonEmpty = <T>(items: T[], what: string): NonEmptyArray<T> => {
  if (!isNonEmpty(items)) {
    throw new Error(`Expected at least one ${what}`)
  }
  return items
}

const withoutReferenceFilters = (filters: CCDLAttributeFilter[]): Exclude<CCDLAttributeFilter, CCDLReferenceAttributeFilter>[] =>
  filters.filter((filter) => filter.type !== 'reference')

/**
 * Translates the active UI query into a CCDL cohort definition. The one public method reads the
 * active query and validates it first, so an invalid or non-active query cannot be translated.
 * All output is new plain data; the UI model is only read.
 */
@Injectable({
  providedIn: 'root',
})
export class UIQuery2StructuredQueryService {
  private criterionProvider = inject(CriterionProviderService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private timeRestrictionTranslation = inject(TimeRestrictionTranslationService)
  private validation = inject(FeasibilityQueryValidationService)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)

  /**
   * Buttons are disabled while the query is invalid, so the error means a bug, not a user mistake.
   */
  public translateActiveQuery(): Observable<CCDLCohortDefinition> {
    return this.feasibilityQueryProvider.getActiveFeasibilityQuery().pipe(
      take(1),
      map((query) => {
        const state = this.validation.validate(query)
        if (!state.isValid) {
          throw this.invalidQueryError(state)
        }
        return this.cohortDefinition(query)
      })
    )
  }

  /**
   *
   * @param state
   */
  private invalidQueryError(state: FeasibilityQueryValidationState): CohortTranslationError {
    if (!state.hasInclusionCriteria) {
      return new CohortTranslationError('NO_INCLUSION_CRITERIA')
    }
    return new CohortTranslationError(
      'INVALID_CRITERIA',
      state.criterionValidationStates.filter((criterion) => !criterion.isValid).map((criterion) => criterion.criterionId)
    )
  }

  /**
   *
   * @param query
   */
  private cohortDefinition(query: FeasibilityQuery): CCDLCohortDefinition {
    const inclusionCriteria = this.criterionGroups(query.getInclusionCriteria())
    if (!inclusionCriteria) {
      throw new CohortTranslationError('NO_INCLUSION_CRITERIA')
    }
    const exclusionCriteria = this.criterionGroups(query.getExclusionCriteria())
    return {
      version: VERSION,
      display: query.getDisplay(),
      inclusionCriteria,
      ...(exclusionCriteria && { exclusionCriteria }),
    }
  }

  /**
   *
   * @param groups
   */
  private criterionGroups(groups: string[][]): NonEmptyArray<NonEmptyArray<CCDLCriterion>> | undefined {
    const translated = groups
      .map((ids: string[]) => ids.map((id: string) => this.criterion(this.criterionProvider.getOne(id))))
      .filter((group): group is NonEmptyArray<CCDLCriterion> => isNonEmpty(group))
    return isNonEmpty(translated) ? translated : undefined
  }

  /**
   *
   * @param criterion
   */
  private criterion(criterion: Criterion): CCDLCriterion {
    return this.criterionOf(criterion, this.attributeFilters(criterion))
  }

  /**
   * A referenced criterion may not reference again (CCDL schema), so nested references are left out.
   * @param criterion
   */
  private referencedCriterion(criterion: Criterion): CCDLReferencedCriterion {
    return this.criterionOf(criterion, withoutReferenceFilters(this.attributeFilters(criterion)))
  }

  /**
   *
   * @param criterion
   * @param attributeFilters
   */
  private criterionOf<F extends CCDLAttributeFilter>(
    criterion: Criterion,
    attributeFilters: F[]
  ): StrictOmit<CCDLCriterion, 'attributeFilters'> & { attributeFilters?: F[], } {
    const timeRestriction = this.timeRestrictionTranslation.translateTimeRestriction(criterion.getTimeRestriction())
    const valueFilter = this.valueFilter(criterion)
    return {
      ...(attributeFilters.length > 0 && { attributeFilters }),
      termCodes: nonEmpty(criterion.getTermCodes().map(termCode), 'term code'),
      context: termCode(criterion.getContext()),
      ...(timeRestriction && { timeRestriction }),
      ...(valueFilter && { valueFilter }),
    }
  }

  /**
   *
   * @param criterion
   */
  private attributeFilters(criterion: Criterion): CCDLAttributeFilter[] {
    return criterion.getAttributeFilters().flatMap((filter) => this.attributeFilter(filter) ?? [])
  }

  /**
   *
   * @param filter
   */
  private attributeFilter(filter: AttributeFilter): CCDLAttributeFilter | undefined {
    const attributeCode = termCode(filter.getAttributeCode())
    if (filter.isConceptSet() && filter.getConcept()?.hasSelectedConcepts()) {
      return { ...this.conceptFilter(filter.getConcept()), attributeCode }
    }
    if (filter.isReferenceSet() && filter.getReference()?.isSelectedReferenceSet()) {
      const referenced = filter
        .getReference()
        .getSelectedReferenceIds()
        .map((id) => this.referencedCriterion(this.referenceCriterionProvider.getOne(id)))
      return {
        type: 'reference',
        criteria: nonEmpty(referenced, 'referenced criterion'),
        attributeCode,
      }
    }
    if (filter.isQuantitySet()) {
      const quantity = this.quantityFilter(filter.getQuantity())
      return quantity && { ...quantity, attributeCode }
    }
  }

  /**
   *
   * @param criterion
   */
  private valueFilter(criterion: Criterion): CCDLValueFilter | undefined {
    for (const valueFilter of criterion.getValueFilters()) {
      const filter =
        (valueFilter.getConcept()?.hasSelectedConcepts() && this.conceptFilter(valueFilter.getConcept())) ||
        (valueFilter.getQuantity() && this.quantityFilter(valueFilter.getQuantity()))
      if (filter) {
        return filter
      }
    }
  }

  /**
   *
   * @param conceptFilter
   */
  private conceptFilter(conceptFilter: ConceptFilter): CCDLConceptFilter {
    return {
      selectedConcepts: nonEmpty(
        conceptFilter.getSelectedConcepts().map((concept) => termCode(concept.getTerminologyCode())),
        'selected concept'
      ),
      type: 'concept',
    }
  }

  /**
   *
   * @param quantity
   */
  private quantityFilter(quantity: AbstractQuantityFilter): CCDLQuantityComparatorFilter | CCDLQuantityRangeFilter | undefined {
    if (quantity instanceof QuantityComparatorFilter) {
      const comparator = COMPARATORS[quantity.getComparator()]
      return (
        comparator && {
          unit: unit(quantity.getSelectedUnit()),
          comparator,
          type: 'quantity-comparator',
          value: quantity.getValue(),
        }
      )
    }
    if (quantity instanceof QuantityRangeFilter) {
      return {
        unit: unit(quantity.getSelectedUnit()),
        minValue: quantity.getMinValue(),
        maxValue: quantity.getMaxValue(),
        type: 'quantity-range',
      }
    }
  }
}
