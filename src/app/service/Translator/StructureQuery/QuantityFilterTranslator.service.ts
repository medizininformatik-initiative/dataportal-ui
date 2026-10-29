import { Injectable } from '@angular/core'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityNotSet } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { QuantityUnitData } from 'src/app/model/Interface/Unit'
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityFilterBuilder } from '../../Factory/QuantityFilterBuilder'

@Injectable({
  providedIn: 'root',
})
export class QuantityFilterTranslatorService {
  constructor() {}

  /**
   * Translate quantity filter from UI profile data and attribute filter data to feasibility query quantity filter.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinitionData
   * @param {AttributeFilterData | ValueFilterData} attributeFilter
   * @returns {QuantityComparatorFilter | QuantityRangeFilter | QuantityNotSet}
   */
  public translate(
    attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData,
    attributeFilter: AttributeFilterData | ValueFilterData
  ): QuantityComparatorFilter | QuantityRangeFilter | QuantityNotSet {
    const quantityBuilder = this.createQuantityBuilderInstance(attributeDefinitionData, attributeFilter)
    const type = attributeFilter.type
    if (type === FilterTypes.QUANTITY_RANGE) {
      return this.buildQuantityRangeInstance(attributeFilter, quantityBuilder)
    }
    if (type === FilterTypes.QUANTITY_COMPARATOR) {
      return this.buildQuantityComparatorInstance(attributeFilter, quantityBuilder)
    }
    return quantityBuilder.buildEmptyQuantityFilter()
  }

  /**
   * Create a quantity filter builder instance from UI profile data.
   * @param uiProfileData
   * @returns {QuantityFilterBuilder}
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinitionData
   * @param {AttributeFilterData | ValueFilterData} attributeFilter
   */
  private createQuantityBuilderInstance(
    attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData,
    attributeFilter: AttributeFilterData | ValueFilterData
  ): QuantityFilterBuilder {
    const precision: number = attributeDefinitionData.precision
    const selectedUnit: QuantityUnit = QuantityUnit.fromJson(attributeFilter.unit)
    const allowedUnits: QuantityUnit[] = this.createAllowedUnitsFromUiProfileData(attributeDefinitionData)
    return new QuantityFilterBuilder(allowedUnits, precision, selectedUnit)
  }

  /**
   * Translates allowed units from UI profile data to quantity unit array.
   * @param uiProfileData
   * @returns {QuantityUnit[]}
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinitionData
   */
  private createAllowedUnitsFromUiProfileData(attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData): QuantityUnit[] {
    const allowedUnits: QuantityUnitData[] = attributeDefinitionData.allowedUnits
    return allowedUnits.map((unitData: QuantityUnitData) => QuantityUnit.fromJson(unitData))
  }

  /**
   * Builds a quantity range filter instance.
   * @param {AttributeFilterData | ValueFilterData} attributeFilter
   * @param {QuantityFilterBuilder} quantityBuilder
   * @returns {QuantityRangeFilter}
   */
  private buildQuantityRangeInstance(
    attributeFilter: AttributeFilterData | ValueFilterData,
    quantityBuilder: QuantityFilterBuilder
  ): QuantityRangeFilter {
    const maxValue: number = attributeFilter.maxValue
    const minValue: number = attributeFilter.minValue
    return quantityBuilder.buildQuantityRangeFilter(minValue, maxValue)
  }

  /**
   * Builds a quantity comparator filter instance.
   * @param {AttributeFilterData | ValueFilterData} attributeFilter
   * @param {QuantityFilterBuilder} quantityBuilder
   * @returns {QuantityComparatorFilter}
   */
  private buildQuantityComparatorInstance(
    attributeFilter: AttributeFilterData | ValueFilterData,
    quantityBuilder: QuantityFilterBuilder
  ): QuantityComparatorFilter {
    const comparator = attributeFilter.comparator
    const value = attributeFilter.value
    const quantityComparisonOption: QuantityComparisonOption = AbstractQuantityFilter.mapComparatorToQuantityComparison(comparator)
    return quantityBuilder.buildQuantityComparatorFilter(value, quantityComparisonOption)
  }
}
