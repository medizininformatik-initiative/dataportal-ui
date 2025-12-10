import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter';
import { AttributeFilter } from './AttributeFilter';
import { Concept } from './Concept/Concept';
import { ConceptFilter } from './Concept/ConceptFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { QuantityNotSet } from './Quantity/QuantityNotSet';
import { QuantityUnit } from '../../../FeasibilityQuery/QuantityUnit';
import { ReferenceCriterion } from '../ReferenceCriterion';
import { ReferenceFilter } from './Concept/ReferenceFilter';
import { TerminologyCode } from '../../../Terminology/TerminologyCode';
import { ValueFilter } from './ValueFilter';

/**
 * Builder class for constructing instances of Valuefilter and AttributeFilter and its subclasses.
 */
export class AttributeFiltersBuilder {
  private display: Display;
  private optional = false;
  private concept?: ConceptFilter;
  private reference?: ReferenceFilter;
  private quantity?: AbstractQuantityFilter;
  private attributeCode?: TerminologyCode;
  private filterType: FilterTypes;

  constructor(display: Display, optional: boolean, filterType: FilterTypes) {
    this.display = display;
    this.optional = optional;
    this.filterType = filterType;
  }

  /**
   * Sets the concept filter.
   *
   * @param concept - Concept filter to set.
   * @returns The builder instance.
   */
  public withConceptFilter(concept: ConceptFilter): AttributeFiltersBuilder {
    this.concept = concept;
    return this;
  }

  /**
   * Sets the reference filter.
   *
   * @param - Reference filter to set.
   * @returns The builder instance.
   */
  public withReferenceFilter(reference: ReferenceFilter): AttributeFiltersBuilder {
    this.reference = reference;
    return this;
  }

  /**
   * Sets the quantity filter.
   *
   * @param quantity - Quantity filter to set.
   * @returns The builder instance.
   */
  public withQuantityFilter(quantity: AbstractQuantityFilter): AttributeFiltersBuilder {
    this.quantity = quantity;
    return this;
  }

  /**
   * Sets the attribute code for AttributeFilter.
   *
   * @param attributeCode - Attribute code to set.
   * @returns The builder instance.
   */
  public withAttributeCode(attributeCode: TerminologyCode): AttributeFiltersBuilder {
    this.attributeCode = attributeCode;
    return this;
  }

  /**
   * Builds an instance of AttributeFilter based on the current builder configuration.
   *
   * @returns An instance of AttributeFilter.
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
    );
  }

  /**
   * Builds an instance of ValueFilter based on the current builder configuration.
   *
   * @returns An instance of ValueFilter.
   */
  public buildValueFilter(): ValueFilter {
    return new ValueFilter(
      this.display,
      this.filterType,
      this.concept,
      this.quantity,
      this.optional
    );
  }

  /**
   * Builds an instance of QuantityNotSet based on the current builder configuration.
   *
   * @returns An instance of QuantityFilter.
   */
  public buildQuantityFilter(
    allowedUnits: QuantityUnit[],
    precision: number,
    selectedUnit?: QuantityUnit
  ): QuantityNotSet {
    return new QuantityNotSet(allowedUnits, selectedUnit, precision);
  }

  public buildConceptFilter(
    id: string,
    allowedConceptUri: string[],
    selectedConcepts: Concept[] = []
  ) {
    return new ConceptFilter(id, allowedConceptUri, selectedConcepts);
  }

  /**
   * Builds an instance of ReferenceFilter based on the current builder configuration.
   *
   * @returns An instance of ReferenceFilter.
   */
  public buildReferenceFilter(
    id: string,
    allowedReferenceUri: string[],
    selectedReference: ReferenceCriterion[] = []
  ): ReferenceFilter {
    return new ReferenceFilter(id, allowedReferenceUri, selectedReference);
  }
}
