import { QuantityUnit } from '../../../../FeasibilityQuery/QuantityUnit'

export class CloneQuantityUnit {
  /**
   * Creates a deep copy of a QuantityUnit instance.
   *
   * @param {QuantityUnit} quantityUnit - The QuantityUnit instance to deep copy.
   * @returns {QuantityUnit} A new QuantityUnit instance that is a deep copy of the given instance.
   */
  public static deepCopyQuantityUnit(quantityUnit: QuantityUnit): QuantityUnit {
    return new QuantityUnit(quantityUnit.getCode(), quantityUnit.getDisplay(), quantityUnit.getSystem())
  }

  /**
   * Creates a deep copy of a QuantityUnit instance.
   *
   * @param quantityUnit - The QuantityUnit instance to deep copy.
   * @returns {QuantityUnit[]} A new QuantityUnit instance that is a deep copy of the given instance.
   * @param {QuantityUnit[]} quantityUnits
   */
  public static deepCopyQuantityUnits(quantityUnits: QuantityUnit[]): QuantityUnit[] {
    return quantityUnits.map((quantityUnit) => this.deepCopyQuantityUnit(quantityUnit))
  }
}
