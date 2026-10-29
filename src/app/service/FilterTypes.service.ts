import { Injectable } from '@angular/core'
import { FilterTypes } from '../model/Utilities/FilterTypes'
import { QuantityComparisonOption } from '../model/Utilities/Quantity/QuantityFilterOptions'

@Injectable({
  providedIn: 'root',
})
export class FilterTypesService {
  public isQuantity(type: FilterTypes) {
    return this.isQuantityComparator(type) || this.isQuantityRange(type) || this.isQuantityNotSet(type) ? true : false
  }

  public isQuantityType(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY ? true : false
  }
  public isQuantityRange(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_RANGE ? true : false
  }

  public isQuantityComparator(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_COMPARATOR ? true : false
  }

  public isQuantityNotSet(type: FilterTypes): boolean {
    return type === FilterTypes.QUANTITY_NOT_SET ? true : false
  }

  public isConcept(type: FilterTypes): boolean {
    return type === FilterTypes.CONCEPT ? true : false
  }

  public isReference(type: FilterTypes): boolean {
    return type === FilterTypes.REFERENCE ? true : false
  }

  public isNoneComparator(type: QuantityComparisonOption): boolean {
    return type === QuantityComparisonOption.NONE ? true : false
  }
}
