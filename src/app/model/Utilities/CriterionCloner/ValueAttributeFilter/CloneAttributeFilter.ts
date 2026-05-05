import { AttributeFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { CloneConceptFilter } from './Concept/CloneConceptFilter';
import { CloneQuantityFilter } from './Quantity/CloneQuantityFilter';
import { CloneReferenceFilter } from './ReferenceFilter/CloneReferenceFilter';
import { CloneTerminologyCode } from '../TerminologyCode/CloneTerminologyCode';
import { ConceptFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { ReferenceFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';

export class CloneAttributeFilter {
  static deepCopyAttributeFilters(
    attributeFilters: AttributeFilter[],
    preserveReferenceFilterIds = false
  ): AttributeFilter[] {
    return attributeFilters.map((attributeFilter) =>
      this.deepCopyAttributeFilter(attributeFilter, preserveReferenceFilterIds)
    );
  }

  /**
   * Creates a deep copy of an AttributeFilter instance.
   *
   * @param attributeFilter - The AttributeFilter instance to deep copy.
   * @param preserveReferenceFilterIds - When true, the ReferenceFilter id is kept instead of generating a new one.
   * @returns A new AttributeFilter instance that is a deep copy of the given instance.
   */
  static deepCopyAttributeFilter(
    attributeFilter: AttributeFilter,
    preserveReferenceFilterIds = false
  ): AttributeFilter {
    if (!(attributeFilter instanceof AttributeFilter)) {
      throw new Error('Invalid instance type for deep copy');
    }

    const copiedAttributeCode = CloneTerminologyCode.deepCopyTerminologyCode(
      attributeFilter.getAttributeCode()
    );
    const copiedConceptFilter = attributeFilter.isConceptSet()
      ? this.copyConceptFilter(attributeFilter.getConcept())
      : undefined;
    const copiedQuantityFilter = attributeFilter.isQuantitySet()
      ? CloneQuantityFilter.deepCopyQuantityFilters(attributeFilter.getQuantity())
      : undefined;
    const copiedReferenceFilter = attributeFilter.isReferenceSet()
      ? this.copyReferenceFilter(attributeFilter.getReference(), preserveReferenceFilterIds)
      : undefined;

    return new AttributeFilter(
      attributeFilter.getDisplay(),
      attributeFilter.getFilterType(),
      copiedAttributeCode,
      copiedConceptFilter,
      copiedQuantityFilter,
      copiedReferenceFilter,
      attributeFilter.getOptional()
    );
  }

  static copyReferenceFilter(
    referenceFilter: ReferenceFilter,
    preserveId = false
  ): ReferenceFilter {
    return CloneReferenceFilter.deepCopyReferenceFilter(referenceFilter, preserveId);
  }

  static copyConceptFilter(conceptFilter: ConceptFilter): ConceptFilter | undefined {
    return conceptFilter ? CloneConceptFilter.deepCopyConceptFilter(conceptFilter) : undefined;
  }
}
