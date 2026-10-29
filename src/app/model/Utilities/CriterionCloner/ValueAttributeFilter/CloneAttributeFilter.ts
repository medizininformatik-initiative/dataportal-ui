import { AttributeFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ReferenceFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { CloneTerminologyCode } from '../TerminologyCode/CloneTerminologyCode'
import { CloneConceptFilter } from './Concept/CloneConceptFilter'
import { CloneQuantityFilter } from './Quantity/CloneQuantityFilter'
import { CloneReferenceFilter } from './ReferenceFilter/CloneReferenceFilter'

export class CloneAttributeFilter {
  public static deepCopyAttributeFilters(attributeFilters: AttributeFilter[], preserveReferenceFilterIds = false): AttributeFilter[] {
    return attributeFilters.map((attributeFilter) => this.deepCopyAttributeFilter(attributeFilter, preserveReferenceFilterIds))
  }

  /**
   * Creates a deep copy of an AttributeFilter instance.
   *
   * @param {AttributeFilter} attributeFilter - The AttributeFilter instance to deep copy.
   * @param {boolean} preserveReferenceFilterIds - When true, the ReferenceFilter id is kept instead of generating a new one.
   * @returns {AttributeFilter} A new AttributeFilter instance that is a deep copy of the given instance.
   */
  public static deepCopyAttributeFilter(attributeFilter: AttributeFilter, preserveReferenceFilterIds = false): AttributeFilter {
    if (!(attributeFilter instanceof AttributeFilter)) {
      throw new Error('Invalid instance type for deep copy')
    }

    const copiedAttributeCode = CloneTerminologyCode.deepCopyTerminologyCode(attributeFilter.getAttributeCode())
    const copiedConceptFilter = attributeFilter.isConceptSet() ? this.copyConceptFilter(attributeFilter.getConcept()) : undefined
    const copiedQuantityFilter = attributeFilter.isQuantitySet()
      ? CloneQuantityFilter.deepCopyQuantityFilters(attributeFilter.getQuantity())
      : undefined
    const copiedReferenceFilter = attributeFilter.isReferenceSet()
      ? this.copyReferenceFilter(attributeFilter.getReference(), preserveReferenceFilterIds)
      : undefined

    return new AttributeFilter(
      attributeFilter.getDisplay(),
      attributeFilter.getFilterType(),
      copiedAttributeCode,
      copiedConceptFilter,
      copiedQuantityFilter,
      copiedReferenceFilter,
      attributeFilter.getOptional()
    )
  }

  public static copyReferenceFilter(referenceFilter: ReferenceFilter, preserveId = false): ReferenceFilter {
    return CloneReferenceFilter.deepCopyReferenceFilter(referenceFilter, preserveId)
  }

  public static copyConceptFilter(conceptFilter: ConceptFilter): ConceptFilter | undefined {
    return conceptFilter ? CloneConceptFilter.deepCopyConceptFilter(conceptFilter) : undefined
  }
}
