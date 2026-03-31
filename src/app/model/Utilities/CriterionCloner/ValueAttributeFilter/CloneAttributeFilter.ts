import { AttributeFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { CloneConceptFilter } from './Concept/CloneConceptFilter';
import { CloneQuantityFilter } from './Quantity/CloneQuantityFilter';
import { CloneReferenceFilter } from './ReferenceFilter/CloneReferenceFilter';
import { CloneTerminologyCode } from '../TerminologyCode/CloneTerminologyCode';
import { ConceptFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { ReferenceFilter } from '../../../FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';

export class CloneAttributeFilter {
  static deepCopyAttributeFilters(attributeFilters: AttributeFilter[]): AttributeFilter[] {
    return attributeFilters.map((attributeFilter) => this.deepCopyAttributeFilter(attributeFilter));
  }

  /**
   * Creates a deep copy of an AttributeFilter instance.
   *
   * @param attributeFilter - The AttributeFilter instance to deep copy.
   * @returns A new AttributeFilter instance that is a deep copy of the given instance.
   */
  static deepCopyAttributeFilter(attributeFilter: AttributeFilter): AttributeFilter {
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
      ? this.copyReferenceFilter(attributeFilter.getReference())
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

  static copyReferenceFilter(referenceFilter: ReferenceFilter): ReferenceFilter {
    return CloneReferenceFilter.deepCopyReferenceFilter(referenceFilter);
  }

  static copyConceptFilter(conceptFilter: ConceptFilter): ConceptFilter | undefined {
    return conceptFilter ? CloneConceptFilter.deepCopyConceptFilter(conceptFilter) : undefined;
  }
}
