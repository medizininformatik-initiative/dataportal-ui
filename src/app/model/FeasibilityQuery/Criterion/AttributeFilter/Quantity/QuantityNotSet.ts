import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractQuantityFilter } from './AbstractQuantityFilter'

export class QuantityNotSet extends AbstractQuantityFilter {
  public type: FilterTypes = FilterTypes.QUANTITY_NOT_SET

  /**
   * Static method to create a QuantityFilter.
   *
   * @param {QuantityUnit} selectedUnit - The selected quantity unit.
   * @param {QuantityUnit[]} allowedUnits - The allowed quantity units.
   * @param {number} precision - The precision of the quantity filter.
   * @returns {QuantityNotSet} The created QuantityFilter instance.
   */
  public static create(selectedUnit?: QuantityUnit, allowedUnits: QuantityUnit[] = [], precision: number = 0): QuantityNotSet {
    return new QuantityNotSet(allowedUnits, selectedUnit, precision)
  }

  public getType(): FilterTypes {
    return FilterTypes.QUANTITY_NOT_SET
  }
}
