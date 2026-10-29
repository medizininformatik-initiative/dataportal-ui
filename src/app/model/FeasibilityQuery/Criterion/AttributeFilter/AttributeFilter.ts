import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { TerminologyCode } from '../../../Terminology/TerminologyCode'
import { AbstractAttributeFilters } from './AbstractAttributeFilters'
import { ConceptFilter } from './Concept/ConceptFilter'
import { ReferenceFilter } from './Concept/ReferenceFilter'
import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter'

export class AttributeFilter extends AbstractAttributeFilters {
  private attributeCode: TerminologyCode

  /**
   * Creates an instance of AttributeFilter.
   *
   * @param {Display} display - The display name for the filter.
   * @param {FilterTypes} filter - The type of the filter (e.g., CONCEPT, QUANTITY).
   * @param {TerminologyCode} attributeCode - The attribute code.
   * @param {ConceptFilter} concept - Optional concept filter.
   * @param {AbstractQuantityFilter} quantity - Optional quantity filter.
   * @param {ReferenceFilter} reference - Optional reference filter.
   * @param {boolean} optional - Whether the filter is optional or not. Default is false.
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
    super(display, filter, concept, quantity, reference, optional)
    this.attributeCode = attributeCode
  }

  /**
   * Gets the attribute code.
   *
   * @returns {TerminologyCode} The attribute code.
   */
  public getAttributeCode(): TerminologyCode {
    return this.attributeCode
  }

  /**
   * Sets the attribute code.
   *
   * @param {TerminologyCode} attributeCode - The new attribute code.
   */
  public setAttributeCode(attributeCode: TerminologyCode): void {
    this.attributeCode = attributeCode
  }
}
