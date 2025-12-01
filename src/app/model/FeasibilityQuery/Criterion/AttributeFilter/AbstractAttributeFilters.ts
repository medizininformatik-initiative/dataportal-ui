import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter';
import { ConceptFilter } from './Concept/ConceptFilter';
import { ReferenceFilter } from './Concept/ReferenceFilter';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions';

export abstract class AbstractAttributeFilters {
  private display: Display;
  private concept?: ConceptFilter;
  private quantity?: AbstractQuantityFilter;
  private reference?: ReferenceFilter;
  private optional = false;
  private filterType: FilterTypes;

  /**
   * Creates an instance of AbstractAttributeFilters.
   *
   * @param display - The display name for the filter.
   * @param filterType
   * @param concept - Optional concept filter.
   * @param quantity - Optional quantity filter.
   * @param reference - Optional reference filter.
   * @param optional - Whether the filter is optional or not. Default is false.
   */
  constructor(
    display: Display,
    filterType: FilterTypes,
    concept?: ConceptFilter,
    quantity?: AbstractQuantityFilter,
    reference?: ReferenceFilter,
    optional: boolean = false
  ) {
    this.display = display;
    this.concept = concept;
    this.quantity = quantity;
    this.reference = reference;
    this.optional = optional;
    this.filterType = filterType;
  }

  /**
   * Gets the display name of the filter.
   *
   * @returns The display name.
   */
  getDisplay(): Display {
    return this.display;
  }

  /**
   * Sets the display name of the filter.
   *
   * @param display - The new display name.
   */
  setDisplay(display: Display): void {
    this.display = display;
  }

  /**
   * Gets the concept filter if set, otherwise returns false.
   *
   * @returns The concept filter or false if not set.
   */
  getConcept(): ConceptFilter {
    return this.concept;
  }

  /**
   * Sets the concept filter.
   *
   * @param concept - The concept filter to set.
   */
  setConcept(concept: ConceptFilter): void {
    this.concept = concept;
  }

  /**
   * Gets the quantity filter if set, otherwise returns false.
   *
   * @returns The quantity filter or false if not set.
   */
  getQuantity(): AbstractQuantityFilter {
    return this.quantity;
  }

  /**
   * Sets the quantity filter.
   *
   * @param quantity - The quantity filter to set.
   */
  setQuantity(quantity: AbstractQuantityFilter): void {
    this.quantity = quantity;
  }

  /**
   * Gets the reference filter if set, otherwise returns false.
   *
   * @returns The reference filter or false if not set.
   */
  getReference(): ReferenceFilter {
    return this.reference;
  }

  /**
   * Sets the reference filter.
   *
   * @param reference - The reference filter to set.
   */
  setReference(reference: ReferenceFilter): void {
    this.reference = reference;
  }

  /**
   * Gets whether the filter is optional.
   *
   * @returns True if the filter is optional, false otherwise.
   */
  getOptional(): boolean {
    return this.optional;
  }

  /**
   * Sets whether the filter is optional.
   *
   * @param optional - True to make the filter optional, false otherwise.
   */
  setOptional(optional: boolean): void {
    this.optional = optional;
  }

  /**
   * Checks if the concept filter is set.
   *
   * @returns True if the concept filter is set, false otherwise.
   */
  isConceptSet(): boolean {
    return this.concept !== undefined;
  }

  /**
   * Checks if the quantity filter is set.
   *
   * @returns True if the quantity filter is set, false otherwise.
   */
  isQuantitySet(): boolean {
    return this.quantity !== undefined;
  }

  /**
   * Checks if the reference filter is set.
   *
   * @returns True if the reference filter is set, false otherwise.
   */
  isReferenceSet(): boolean {
    return this.reference !== undefined;
  }

  getFilterType(): FilterTypes {
    return this.filterType;
  }
}
