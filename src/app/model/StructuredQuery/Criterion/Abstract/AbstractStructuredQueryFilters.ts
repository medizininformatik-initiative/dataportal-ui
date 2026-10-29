import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from '../../../Utilities/FilterTypes'

/**
 * Abstract base class for structured query filters.
 *
 * @abstract
 */
export abstract class AbstractStructuredQueryFilters {
  protected abstract type: FilterTypes

  /**
   * Constructor to initialize the AbstractStructuredQueryFilters with attribute code and type.
   *
   * @param attributeCode - The attribute code for the filter.
   * @param type - The type of filter.
   */
  constructor() {}

  /**
   * Gets the type value.
   *
   * @returns {FilterTypes} The type value.
   */
  public getType(): FilterTypes {
    return this.type
  }

  /**
   * Sets the type value.
   *
   * @param {FilterTypes} type - The new type value to set.
   */
  public setType(type: FilterTypes): void {
    this.type = type
  }
}
