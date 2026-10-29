import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityUnit } from '../../../FeasibilityQuery/QuantityUnit'
import { TerminologyCode } from '../../../Terminology/TerminologyCode'
import { ReferenceCriterion } from '../ReferenceCriterion'
import { AttributeFilter } from './AttributeFilter'
import { Concept } from './Concept/Concept'
import { ConceptFilter } from './Concept/ConceptFilter'
import { ReferenceFilter } from './Concept/ReferenceFilter'
import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter'
import { QuantityNotSet } from './Quantity/QuantityNotSet'
import { ValueFilter } from './ValueFilter'

/**
 * Builder class for constructing instances of Valuefilter and AttributeFilter and its subclasses.
 */
export class AttributeFiltersBuilder {
  private readonly display: Display
  private readonly optional: boolean = false
  private concept?: ConceptFilter
  private reference?: ReferenceFilter
  private quantity?: AbstractQuantityFilter
  private attributeCode?: TerminologyCode
  private readonly filterType: FilterTypes

  constructor(display: Display, optional: boolean, filterType: FilterTypes) {
    this.display = display
    this.optional = optional
    this.filterType = filterType
  }

  /**
   * Sets the concept filter.
   *
   * @param {ConceptFilter} concept - Concept filter to set.
   * @returns {AttributeFiltersBuilder} The builder instance.
   */
  public withConceptFilter(concept: ConceptFilter): AttributeFiltersBuilder {
    this.concept = concept
    return this
  }

  /**
   * Sets the reference filter.
   *
   * @param - Reference filter to set.
   * @returns {AttributeFiltersBuilder} The builder instance.
   * @param {ReferenceFilter} reference
   */
  public withReferenceFilter(reference: ReferenceFilter): AttributeFiltersBuilder {
    this.reference = reference
    return this
  }

  /**
   * Sets the quantity filter.
   *
   * @param {AbstractQuantityFilter} quantity - Quantity filter to set.
   * @returns {AttributeFiltersBuilder} The builder instance.
   */
  public withQuantityFilter(quantity: AbstractQuantityFilter): AttributeFiltersBuilder {
    this.quantity = quantity
    return this
  }

  /**
   * Sets the attribute code for AttributeFilter.
   *
   * @param {TerminologyCode} attributeCode - Attribute code to set.
   * @returns {AttributeFiltersBuilder} The builder instance.
   */
  public withAttributeCode(attributeCode: TerminologyCode): AttributeFiltersBuilder {
    this.attributeCode = attributeCode
    return this
  }

  /**
   * Builds an instance of AttributeFilter based on the current builder configuration.
   *
   * @returns {AttributeFilter} An instance of AttributeFilter.
   */
  public buildAttributeFilter(): AttributeFilter {
    return new AttributeFilter(
      this.display,
      this.filterType,
      this.attributeCode,
      this.concept,
      this.quantity,
      this.reference,
      this.optional
    )
  }

  /**
   * Builds an instance of ValueFilter based on the current builder configuration.
   *
   * @returns {ValueFilter} An instance of ValueFilter.
   */
  public buildValueFilter(): ValueFilter {
    return new ValueFilter(this.display, this.filterType, this.concept, this.quantity, this.optional)
  }

  /**
   * Builds an instance of QuantityNotSet based on the current builder configuration.
   *
   * @returns {QuantityNotSet} An instance of QuantityFilter.
   * @param {QuantityUnit[]} allowedUnits
   * @param {number} precision
   * @param {QuantityUnit} selectedUnit
   */
  public buildQuantityFilter(allowedUnits: QuantityUnit[], precision: number, selectedUnit?: QuantityUnit): QuantityNotSet {
    return new QuantityNotSet(allowedUnits, selectedUnit, precision)
  }

  public buildConceptFilter(id: string, allowedConceptUri: string[], selectedConcepts: Concept[] = []) {
    return new ConceptFilter(id, allowedConceptUri, selectedConcepts)
  }

  /**
   * Builds an instance of ReferenceFilter based on the current builder configuration.
   *
   * @returns {ReferenceFilter} An instance of ReferenceFilter.
   * @param {string} id
   * @param {string[]} allowedReferenceUri
   * @param {ReferenceCriterion[]} selectedReference
   */
  public buildReferenceFilter(id: string, allowedReferenceUri: string[], selectedReference: ReferenceCriterion[] = []): ReferenceFilter {
    return new ReferenceFilter(
      id,
      allowedReferenceUri,
      selectedReference.map((r: ReferenceCriterion) => r.getId())
    )
  }
}
