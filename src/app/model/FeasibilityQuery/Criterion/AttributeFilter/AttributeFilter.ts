import { AbstractAttributeFilters } from './AbstractAttributeFilters';
import { TerminologyCode } from '../../../Terminology/TerminologyCode';
import { ConceptFilter } from './Concept/ConceptFilter';
import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter';
import { ReferenceFilter } from './Concept/ReferenceFilter';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { Display } from 'src/app/model/DataSelection/Profile/Display';

export class AttributeFilter extends AbstractAttributeFilters {
  private attributeCode: TerminologyCode;

  /**
   * Creates an instance of AttributeFilter.
   *
   * @param display - The display name for the filter.
   * @param filter - The type of the filter (e.g., CONCEPT, QUANTITY).
   * @param attributeCode - The attribute code.
   * @param concept - Optional concept filter.
   * @param quantity - Optional quantity filter.
   * @param reference - Optional reference filter.
   * @param optional - Whether the filter is optional or not. Default is false.
   */
  constructor(
    display: Display,
    filter: FilterTypes,
    attributeCode: TerminologyCode,
    concept?: ConceptFilter,
    quantity?: AbstractQuantityFilter,
    reference?: ReferenceFilter,
    optional: boolean = false
  ) {
    super(display, filter, concept, quantity, reference, optional);
    this.attributeCode = attributeCode;
  }

  /**
   * Gets the attribute code.
   *
   * @returns The attribute code.
   */
  getAttributeCode(): TerminologyCode {
    return this.attributeCode;
  }

  /**
   * Sets the attribute code.
   *
   * @param attributeCode - The new attribute code.
   */
  setAttributeCode(attributeCode: TerminologyCode): void {
    this.attributeCode = attributeCode;
  }
}
