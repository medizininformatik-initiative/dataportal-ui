import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractQuantityFilter } from '../AbstractQuantityFilter'

export abstract class AbstractQuantityRangeFilter extends AbstractQuantityFilter {
  private minValue: number = null
  private maxValue: number = null
  protected type: FilterTypes = FilterTypes.QUANTITY_RANGE

  /**
   * Creates a new AbstractQuantityRangeFilter.
   *
   * @param minValue
   * @param maxValue
   * @param unit
   */
  constructor(minValue: number, maxValue: number, unit: QuantityUnit) {
    super(unit)
    this.minValue = minValue
    this.maxValue = maxValue
  }

  public getMinValue(): number {
    return this.minValue
  }

  /**
   * Sets the min value.
   *
   * @param minValue
   */
  public setMinValue(minValue: number): void {
    this.minValue = minValue
  }

  public getMaxValue(): number {
    return this.maxValue
  }

  /**
   * Sets the max value.
   *
   * @param maxValue
   */
  public setMaxValue(maxValue: number): void {
    this.maxValue = maxValue
  }

  public getType(): FilterTypes {
    return this.type
  }

  /**
   * Sets the type.
   *
   * @param type
   */
  public setType(type: FilterTypes): void {
    this.type = type
  }
}
