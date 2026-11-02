import { Injectable } from '@angular/core'
import { FilterTypes } from '../model/Utilities/FilterTypes'
import { QuantityComparisonOption } from '../model/Utilities/Quantity/QuantityFilterOptions'

@Injectable({
  providedIn: 'root',
})
export class FilterTypesService {
  /**
   * Checks whether the type is any quantity filter type.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isQuantity(type: FilterTypes): boolean {
    return this.isQuantityComparator(type) || this.isQuantityRange(type) || this.isQuantityNotSet(type) ? true : false
  }

  /**
   * Checks whether the type is the general quantity type.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isQuantityType(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY ? true : false
  }
  /**
   * Checks whether the type is a quantity range.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isQuantityRange(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_RANGE ? true : false
  }

  /**
   * Checks whether the type is a quantity comparator.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isQuantityComparator(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_COMPARATOR ? true : false
  }

  /**
   * Checks whether the type is a quantity without a value.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isQuantityNotSet(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_NOT_SET ? true : false
  }

  /**
   * Checks whether the type is a concept.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isConcept(type: FilterTypes): boolean {
    return type === FilterTypes.CONCEPT ? true : false
  }

  /**
   * Checks whether the type is a reference.
   * @param {FilterTypes} type
   * @returns {boolean}
   */
  public isReference(type: FilterTypes): boolean {
    return type === FilterTypes.REFERENCE ? true : false
  }

  /**
   * Checks whether the comparator is none.
   * @param {QuantityComparisonOption} type
   * @returns {boolean}
   */
  public isNoneComparator(type: QuantityComparisonOption): boolean {
    return type === QuantityComparisonOption.NONE ? true : false
  }
}
