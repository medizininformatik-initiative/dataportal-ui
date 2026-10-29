import { QuantityUnit } from 'src/app/model/StructuredQuery/QuantityUnit'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { Comparator } from 'src/app/model/Utilities/Quantity/Comparator'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { AbstractQuantityComparatorFilter } from '../../Abstract/Quantity/Comparator/AbstractQuantityComparatorFilter'

export class QuantityComparatorAttributeFilter extends AbstractQuantityComparatorFilter {
  private attributeCode: TerminologyCode

  /**
   * Creates a new QuantityComparatorAttributeFilter.
   *
   * @param attributeCode
   * @param unit
   * @param comparator
   * @param value
   */
  constructor(attributeCode: TerminologyCode, unit: QuantityUnit, comparator: Comparator, value: number) {
    super(unit, comparator, value)
    this.attributeCode = attributeCode
  }

  /**
   * Gets the attributeCode value.
   *
   * @returns The attributeCode value.
   */
  public getAttributeCode(): TerminologyCode {
    return this.attributeCode
  }

  /**
   * Sets the attributeCode value.
   *
   * @param attributeCode - The new attributeCode value to set.
   */
  public setAttributeCode(attributeCode: TerminologyCode): void {
    this.attributeCode = attributeCode
  }

  /**
   * Creates a filter from the given values.
   *
   * @param attributeCode
   * @param unit
   * @param comparator
   * @param value
   */
  public static createFilter(attributeCode: TerminologyCode, unit: QuantityUnit, comparator: Comparator, value: number) {
    return new QuantityComparatorAttributeFilter(attributeCode, unit, comparator, value)
  }
}
