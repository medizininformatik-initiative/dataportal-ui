import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractStructuredQueryFilters } from '../AbstractStructuredQueryFilters'

/**
 * Abstract base class for quantity filters in a structured query.
 *
 * This class extends the base structured query filters to include a unit
 * and a filter type.
 *
 * @abstract
 */
export abstract class AbstractQuantityFilter extends AbstractStructuredQueryFilters {
  private unit: QuantityUnit
  protected abstract type: FilterTypes

  /**
   * Constructor to initialize the AbstractQuantityFilter with unit and type.
   *
   * @param unit - The unit for the filter.
   * @param type - The type of filter.
   * @param attributeCode - The attribute code for the filter.
   */
  constructor(unit: QuantityUnit) {
    super()
    this.unit = unit
  }

  /**
   * Gets the unit value.
   *
   * @returns The unit value.
   */
  public getUnit(): QuantityUnit {
    return this.unit
  }

  /**
   * Sets the unit value.
   *
   * @param unit - The new unit value to set.
   */
  public setUnit(unit: QuantityUnit): void {
    this.unit = unit
  }

  /**
   * Gets the type value.
   *
   * @returns The type value.
   */
  public getType(): FilterTypes {
    return this.type
  }
}
