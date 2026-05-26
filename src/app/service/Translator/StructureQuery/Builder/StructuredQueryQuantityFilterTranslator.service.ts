import { AbstractQuantityComparatorFilter } from 'src/app/model/StructuredQuery/Criterion/Abstract/Quantity/Comparator/AbstractQuantityComparatorFilter'
import { AbstractQuantityFilter as AbstractQuantityFilterFQ } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AbstractQuantityFilter as AbstractQuantityFilterSQ } from 'src/app/model/StructuredQuery/Criterion/Abstract/Quantity/AbstractQuantityFilter'
import { AbstractQuantityRangeFilter } from 'src/app/model/StructuredQuery/Criterion/Abstract/Quantity/Range/AbstractQuantityRangeFilter'
import { FilterTypesService } from '../../../FilterTypes.service'
import { Injectable, inject } from '@angular/core'
import { QuantityComparatorAttributeFilter } from 'src/app/model/StructuredQuery/Criterion/AttributeFilters/QuantityFilter/QuantityComparatorAttributeFilter'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityComparatorValueFilter } from 'src/app/model/StructuredQuery/Criterion/ValueFilter/Quantity/QuantityComparatorValueFilter'
import { QuantityRangeAttributeFilter } from 'src/app/model/StructuredQuery/Criterion/AttributeFilters/QuantityFilter/QuantityRangeAttributeFilter'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityRangeValueFilter } from 'src/app/model/StructuredQuery/Criterion/ValueFilter/Quantity/QuantityRangeValueFilter'
import { QuantityUnit as QuantityUnitSQ } from '../../../../model/StructuredQuery/QuantityUnit'
import { QuantityUnit as QuantityUnitFQ } from '../../../../model/FeasibilityQuery/QuantityUnit'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

@Injectable({
  providedIn: 'root',
})
export class StructuredQueryQuantityFilterTranslatorService {
  private filter = inject(FilterTypesService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates a quantity filter based on the type of quantity filter.
   *
   * @param attributeCode The attribute code.
   * @param abstractAttributeFilter The attribute filter containing quantity details.
   * @returns The structured query quantity filter.
   */
  public translateQuantityAttributeFilter(
    attributeCode: TerminologyCode,
    abstractAttributeFilter: AbstractQuantityFilterFQ
  ): AbstractQuantityFilterSQ | undefined {
    const type = abstractAttributeFilter.getType()

    if (this.filter.isQuantityComparator(type)) {
      return this.createQuantityComparatorFilter(
        abstractAttributeFilter as QuantityComparatorFilter,
        attributeCode
      )
    } else if (this.filter.isQuantityRange(type)) {
      return this.createQuantityRangeFilter(
        abstractAttributeFilter as QuantityRangeFilter,
        attributeCode
      )
    }
    return undefined
  }

  public translateQuantityValueFilter(
    abstractAttributeFilter: AbstractQuantityFilterFQ
  ): AbstractQuantityFilterSQ | undefined {
    const type = abstractAttributeFilter.getType()

    if (this.filter.isQuantityComparator(type)) {
      return this.createQuantityComparatorFilter(
        abstractAttributeFilter as QuantityComparatorFilter
      )
    } else if (this.filter.isQuantityRange(type)) {
      return this.createQuantityRangeFilter(abstractAttributeFilter as QuantityRangeFilter)
    }
    return undefined
  }

  private createQuantityComparatorFilter(
    abstractQuantityComparatorFilter: QuantityComparatorFilter,
    attributeCode?: TerminologyCode
  ): AbstractQuantityComparatorFilter | undefined {
    if (!this.filter.isNoneComparator(abstractQuantityComparatorFilter.getComparator())) {
      return this.setQuantityComparatorAttributes(abstractQuantityComparatorFilter, attributeCode)
    }
    return undefined
  }

  public createQuantityRangeFilter(
    quantityRange: QuantityRangeFilter,
    attributeCode?: TerminologyCode
  ): AbstractQuantityRangeFilter {
    const minValue = quantityRange.getMinValue()
    const maxValue = quantityRange.getMaxValue()
    const unit = this.assignQuantityUnit(quantityRange.getSelectedUnit())

    if (attributeCode) {
      return new QuantityRangeAttributeFilter(attributeCode, minValue, maxValue, unit)
    } else {
      return new QuantityRangeValueFilter(minValue, maxValue, unit)
    }
  }

  public setQuantityComparatorAttributes(
    quantityComparator: QuantityComparatorFilter,
    attributeCode?: TerminologyCode
  ): AbstractQuantityComparatorFilter {
    const unit = this.assignQuantityUnit(quantityComparator.getSelectedUnit())

    if (attributeCode) {
      return new QuantityComparatorAttributeFilter(
        attributeCode,
        unit,
        quantityComparator.mapQuantityComparisonToComparator(quantityComparator.getComparator()),
        quantityComparator.getValue()
      )
    } else {
      return new QuantityComparatorValueFilter(
        unit,
        quantityComparator.mapQuantityComparisonToComparator(quantityComparator.getComparator()),
        quantityComparator.getValue()
      )
    }
  }

  private assignQuantityUnit(quantityUnit: QuantityUnitFQ): QuantityUnitSQ {
    return new QuantityUnitSQ(quantityUnit.getCode(), quantityUnit.getDisplay())
  }
}
