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
  CCDLValueFilter,
} from 'src/app/model/CohortDefinition/CCDLFilters'
import { CCDLReferencedCriterion } from 'src/app/model/CohortDefinition/CCDLFilters'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { isNonEmpty, NonEmptyArray } from 'src/app/shared/types/NonEmptyArray'
import { StrictOmit } from 'src/app/shared/types/StrictOmit'
import { Concept } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilter } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ReferenceFilter } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { ValueFilter } from '../../../model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { Criterion } from '../../../model/FeasibilityQuery/Criterion/Criterion'
import { FeasibilityQuery } from '../../../model/FeasibilityQuery/FeasibilityQuery'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service'
import { CriterionValidationState } from '../../Validation/Internal/CriterionValidationService.service'
import {
  FeasibilityQueryValidationService,
  FeasibilityQueryValidationState,
} from '../../Validation/Internal/FeasibilityQueryValidationService.service'
import { mapTermCode, mapTimeRestriction, mapUnit, requireNonEmpty, requireNumber } from '../Shared/CohortDefinitionMapper'

const VERSION = 'http://to_be_decided.com/draft-1/schema#'

/** `ge`, `le`, `ne` and between are not producible by the editor and stay out of the output. */
const COMPARATORS: Partial<Record<QuantityComparisonOption, CCDLComparator>> = {
  [QuantityComparisonOption.EQUAL]: 'eq',
  [QuantityComparisonOption.LESS_THAN]: 'lt',
  [QuantityComparisonOption.GREATER_THAN]: 'gt',
}

/**
 * Drops the reference filters, because a referenced criterion may not reference again.
 * @param {CCDLAttributeFilter[]} filters
 * @returns {Exclude<CCDLAttributeFilter, CCDLReferenceAttributeFilter>[]}
 */
const omitReferenceFilters = (filters: CCDLAttributeFilter[]): Exclude<CCDLAttributeFilter, CCDLReferenceAttributeFilter>[] =>
  filters.filter((filter: CCDLAttributeFilter) => filter.type !== 'reference')

/**
 * Translates the active UI query into a CCDL cohort definition. The one public method reads the
 * active query and validates it first, so an invalid or non-active query cannot be translated.
 * All output is new plain data; the UI model is only read.
 */
@Injectable({
  providedIn: 'root',
})
export class ToCohortDefinitionService {
  private criterionProvider = inject(CriterionProviderService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private validation = inject(FeasibilityQueryValidationService)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)

  /**
   * Translates the active query once; an error means a bug, because buttons are disabled while it is invalid.
   * @returns {Observable<CCDLCohortDefinition>}
   */
  public getActive(): Observable<CCDLCohortDefinition> {
    return this.feasibilityQueryProvider.getActiveFeasibilityQuery().pipe(
      take(1),
      map((query: FeasibilityQuery) => this.validateAndTranslate(query))
    )
  }

  /**
   * Validates the query and translates it into a CCDL cohort definition, throwing if it is invalid.
   * @param {FeasibilityQuery} query
   * @returns {CCDLCohortDefinition}
   */
  public validateAndTranslate(query: FeasibilityQuery): CCDLCohortDefinition {
    const state = this.validation.validate(query)
    if (!state.isValid) {
      throw this.buildInvalidQueryError(state)
    }
    return this.buildCohortDefinition(query)
  }

  /**
   * Builds the error that names why the query is invalid.
   * @param {FeasibilityQueryValidationState} state
   * @returns {CohortTranslationError}
   */
  private buildInvalidQueryError(state: FeasibilityQueryValidationState): CohortTranslationError {
    if (!state.hasInclusionCriteria) {
      return new CohortTranslationError('NO_INCLUSION_CRITERIA')
    }
    return new CohortTranslationError(
      'INVALID_CRITERIA',
      state.criterionValidationStates
        .filter((criterion: CriterionValidationState) => !criterion.isValid)
        .map((criterion: CriterionValidationState) => criterion.criterionId)
    )
  }

  /**
   * Translates the inclusion and exclusion criteria of a valid query.
   * @param {FeasibilityQuery} query
   * @returns {CCDLCohortDefinition}
   */
  private buildCohortDefinition(query: FeasibilityQuery): CCDLCohortDefinition {
    const inclusionCriteria = this.mapCriterionGroups(query.getInclusionCriteria())
    if (!inclusionCriteria) {
      throw new CohortTranslationError('NO_INCLUSION_CRITERIA')
    }
    const exclusionCriteria = this.mapCriterionGroups(query.getExclusionCriteria())
    const display = query.getDisplay()
    return {
      version: VERSION,
      display,
      inclusionCriteria,
      ...(exclusionCriteria && { exclusionCriteria }),
    }
  }

  /**
   * Translates the criterion ids of each group and drops empty groups.
   * @param {string[][]} groups
   * @returns {NonEmptyArray<NonEmptyArray<CCDLCriterion>> | undefined}
   */
  private mapCriterionGroups(groups: string[][]): NonEmptyArray<NonEmptyArray<CCDLCriterion>> | undefined {
    const translated = groups.map((ids: string[]) => this.mapCriterionGroup(ids)).filter(isNonEmpty)
    return isNonEmpty(translated) ? translated : undefined
  }

  /**
   * Translates the criteria of one group.
   * @param {string[]} ids
   * @returns {CCDLCriterion[]}
   */
  private mapCriterionGroup(ids: string[]): CCDLCriterion[] {
    return ids.map((id: string) => this.mapCriterionById(id))
  }

  /**
   * Looks up a criterion by id and translates it.
   * @param {string} id
   * @returns {CCDLCriterion}
   */
  private mapCriterionById(id: string): CCDLCriterion {
    return this.mapCriterion(this.criterionProvider.getOne(id))
  }

  /**
   * Translates a criterion including its nested reference filters.
   * @param {Criterion} criterion
   * @returns {CCDLCriterion}
   */
  private mapCriterion(criterion: Criterion): CCDLCriterion {
    return this.buildCriterion(criterion, this.mapAttributeFilters(criterion))
  }

  /**
   * Translates the criteria a reference filter points at.
   * @param {ReferenceFilter} reference
   * @returns {NonEmptyArray<CCDLReferencedCriterion>}
   */
  private mapReferencedCriteria(reference: ReferenceFilter): NonEmptyArray<CCDLReferencedCriterion> {
    const ids = reference.getSelectedReferenceIds()
    const referenced = ids.map((id: string) => this.mapReferencedCriterionById(id))
    return requireNonEmpty(referenced, 'criteria')
  }

  /**
   * Looks up a referenced criterion by id and translates it.
   * @param {string} id
   * @returns {CCDLReferencedCriterion}
   */
  private mapReferencedCriterionById(id: string): CCDLReferencedCriterion {
    return this.mapReferencedCriterion(this.referenceCriterionProvider.getOne(id))
  }

  /**
   * Translates a referenced criterion and leaves out nested references, which the CCDL schema forbids.
   * @param {Criterion} criterion
   * @returns {CCDLReferencedCriterion}
   */
  private mapReferencedCriterion(criterion: Criterion): CCDLReferencedCriterion {
    return this.buildCriterion(criterion, omitReferenceFilters(this.mapAttributeFilters(criterion)))
  }

  /**
   * Builds a CCDL criterion from a UI criterion and the already translated attribute filters.
   * @param {Criterion} criterion
   * @param {Filter[]} attributeFilters
   * @returns {StrictOmit<CCDLCriterion, 'attributeFilters'> & { attributeFilters?: F[] }}
   */
  private buildCriterion<Filter extends CCDLAttributeFilter>(
    criterion: Criterion,
    attributeFilters: Filter[]
  ): StrictOmit<CCDLCriterion, 'attributeFilters'> & {
    attributeFilters?: Filter[]
  } {
    const timeRestriction = mapTimeRestriction(criterion.getTimeRestriction())
    const termcodes = requireNonEmpty(criterion.getTermCodes().map(mapTermCode), 'termCodes')
    const uiContext = criterion.getContext()
    if (!uiContext) {
      throw new Error('Expected a context on the criterion')
    }
    const context = mapTermCode(uiContext)
    const valueFilter = this.findSelectedValueFilter(criterion)
    return {
      ...(attributeFilters.length > 0 && { attributeFilters }),
      termCodes: termcodes,
      context: context,
      ...(timeRestriction && { timeRestriction }),
      ...(valueFilter && { valueFilter }),
    }
  }

  /**
   * Translates all attribute filters of a criterion and skips the ones without a selection.
   * @param {Criterion} criterion
   * @returns {CCDLAttributeFilter[]}
   */
  private mapAttributeFilters(criterion: Criterion): CCDLAttributeFilter[] {
    return criterion
      .getAttributeFilters()
      .filter((filter: AttributeFilter) => filter.hasSelection())
      .flatMap((filter: AttributeFilter) => this.mapAttributeFilter(filter) ?? [])
  }

  /**
   * Translates one attribute filter that holds a selection, or returns undefined for an unsupported quantity.
   * @param {AttributeFilter} filter
   * @returns {CCDLAttributeFilter | undefined}
   */
  private mapAttributeFilter(filter: AttributeFilter): CCDLAttributeFilter | undefined {
    const attributeCode = mapTermCode(filter.getAttributeCode())
    if (filter.isConceptSet()) {
      return { ...this.mapConceptFilter(filter.getConcept()), attributeCode }
    }
    if (filter.isReferenceSet()) {
      const criteria = this.mapReferencedCriteria(filter.getReference())
      return { type: 'reference', criteria, attributeCode }
    }
    if (filter.isQuantitySet()) {
      const quantity = this.mapQuantityFilter(filter.getQuantity())
      return quantity && { ...quantity, attributeCode }
    }
  }

  /**
   * Translates the first value filter of a criterion that has a selection.
   * @param {Criterion} criterion
   * @returns {CCDLValueFilter | undefined}
   */
  private findSelectedValueFilter(criterion: Criterion): CCDLValueFilter | undefined {
    const selected = criterion.getValueFilters().filter((valueFilter: ValueFilter) => valueFilter.hasSelection())
    for (const valueFilter of selected) {
      const filter =
        (valueFilter.getConcept()?.hasSelectedConcepts() && this.mapConceptFilter(valueFilter.getConcept())) ||
        (valueFilter.getQuantity() && this.mapQuantityFilter(valueFilter.getQuantity()))
      if (filter) {
        return filter
      }
    }
  }

  /**
   * Translates the selected concepts of a concept filter.
   * @param {ConceptFilter} conceptFilter
   * @returns {CCDLConceptFilter}
   */
  private mapConceptFilter(conceptFilter: ConceptFilter): CCDLConceptFilter {
    const termCodes = conceptFilter.getSelectedConcepts().map((concept: Concept) => mapTermCode(concept.getTerminologyCode()))
    const selectedConcepts = requireNonEmpty(termCodes, 'selectedConcepts')
    return { selectedConcepts, type: 'concept' }
  }

  /**
   * Translates a comparator or range filter, or returns undefined for an unsupported comparator.
   * @param {AbstractQuantityFilter} quantity
   * @returns {CCDLQuantityComparatorFilter | CCDLQuantityRangeFilter | undefined}
   */
  private mapQuantityFilter(quantity: AbstractQuantityFilter): CCDLQuantityComparatorFilter | CCDLQuantityRangeFilter | undefined {
    const unit = mapUnit(quantity.getSelectedUnit())
    if (quantity instanceof QuantityComparatorFilter) {
      const comparator = COMPARATORS[quantity.getComparator()]
      if (!comparator) {
        return undefined
      }
      const value = requireNumber(quantity.getValue(), 'value')
      return { unit, comparator, type: 'quantity-comparator', value }
    }
    if (quantity instanceof QuantityRangeFilter) {
      const minValue = requireNumber(quantity.getMinValue(), 'minValue')
      const maxValue = requireNumber(quantity.getMaxValue(), 'maxValue')
      return { unit, minValue, maxValue, type: 'quantity-range' }
    }
  }
}
