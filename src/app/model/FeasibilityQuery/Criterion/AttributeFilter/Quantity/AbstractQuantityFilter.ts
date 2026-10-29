import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { Comparator } from 'src/app/model/Utilities/Quantity/Comparator'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityUnit } from '../../../QuantityUnit'

/**
 * Abstract class representing a quantity filter.
 */
export abstract class AbstractQuantityFilter {
  private selectedUnit: QuantityUnit
  private allowedUnits: QuantityUnit[] = []
  private precision: number
  protected comparator: QuantityComparisonOption = QuantityComparisonOption.NONE

  /**
   * Creates an instance of AbstractQuantityFilter.
   *
   * @param {QuantityUnit[]} allowedUnits - The allowed quantity units.
   * @param {QuantityUnit} selectedUnit - The selected quantity unit.
   * @param {number} precision - The precision of the quantity filter.
   */
  constructor(allowedUnits: QuantityUnit[], selectedUnit?: QuantityUnit, precision: number = 0) {
    this.selectedUnit = selectedUnit
    this.allowedUnits = allowedUnits
    this.precision = precision
  }

  /**
   * Gets the selected quantity unit.
   *
   * @returns {QuantityUnit} The selected quantity unit.
   */
  public getSelectedUnit(): QuantityUnit {
    return this.selectedUnit
  }

  /**
   * Sets the selected quantity unit.
   *
   * @param {QuantityUnit} selectedUnit - The selected quantity unit.
   */
  public setSelectedUnit(selectedUnit: QuantityUnit): void {
    this.selectedUnit = selectedUnit
  }

  /**
   * Gets the allowed quantity units.
   *
   * @returns {QuantityUnit[]} An array of allowed quantity units.
   */
  public getAllowedUnits(): QuantityUnit[] {
    return this.allowedUnits
  }

  /**
   * Sets the allowed quantity units.
   *
   * @param {QuantityUnit[]} allowedUnits - An array of allowed quantity units.
   */
  public setAllowedUnits(allowedUnits: QuantityUnit[]): void {
    this.allowedUnits = allowedUnits
  }

  /**
   * Gets the precision of the quantity filter.
   *
   * @returns {number} The precision value.
   */
  public getPrecision(): number {
    return this.precision
  }

  /**
   * Sets the precision of the quantity filter.
   *
   * @param {number} precision - The precision value.
   */
  public setPrecision(precision: number): void {
    this.precision = precision
  }

  public getComparator(): QuantityComparisonOption {
    return this.comparator
  }

  public setComparator(comparator: QuantityComparisonOption): void {
    this.comparator = comparator
  }

  public static mapQuantityComparisonToComparator(option: QuantityComparisonOption): Comparator {
    switch (option) {
      case QuantityComparisonOption.NONE:
        return Comparator.NONE
      case QuantityComparisonOption.EQUAL:
        return Comparator.EQUAL
      case QuantityComparisonOption.LESS_THAN:
        return Comparator.LESS_THAN
      case QuantityComparisonOption.GREATER_THAN:
        return Comparator.GREATER_THAN
      case QuantityComparisonOption.BETWEEN:
        return Comparator.BETWEEN
      default:
        return Comparator.NONE
    }
  }

  public static mapComparatorToQuantityComparison(comparator: Comparator): QuantityComparisonOption {
    switch (comparator) {
      case Comparator.NONE:
        return QuantityComparisonOption.NONE
      case Comparator.EQUAL:
        return QuantityComparisonOption.EQUAL
      case Comparator.LESS_THAN:
        return QuantityComparisonOption.LESS_THAN
      case Comparator.GREATER_THAN:
        return QuantityComparisonOption.GREATER_THAN
      case Comparator.BETWEEN:
        return QuantityComparisonOption.BETWEEN
      default:
        return QuantityComparisonOption.NONE
    }
  }

  public abstract getType(): FilterTypes
}
