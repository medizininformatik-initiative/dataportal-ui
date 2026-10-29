import { Injectable } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { AttributeFiltersBuilder } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFiltersBuilder'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData'
import { QuantityUnitData } from 'src/app/model/Interface/Unit'
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { v4 as uuidv4 } from 'uuid'

/**
 * Factory service for creating attribute filters and value filters from their definitions.
 * Handles the instantiation and configuration of various filter types (Concept, Quantity, Reference).
 */
@Injectable({
  providedIn: 'root',
})
export class AttributeFilterFactoryService {
  constructor() {}

  /**
   * Creates an AttributeFilter instance from an attribute definition.
   * @param {AttributeDefinitionData} attributeDefinition - The attribute definition data to convert
   * @returns {AttributeFilter} A fully configured AttributeFilter instance
   */
  public createAttributeFilter(attributeDefinition: AttributeDefinitionData): AttributeFilter {
    const builder = this.initializeFilterBuilder(attributeDefinition)
    const filtersBuilder = this.addFiltersToBuilder(attributeDefinition, builder)
    builder.withAttributeCode(TerminologyCode.fromJson(attributeDefinition.attributeCode))
    return filtersBuilder.buildAttributeFilter()
  }

  /**
   * Creates a ValueFilter instance from a value definition.
   * @param {ValueDefinitionData} valueDefinition - The value definition data to convert
   * @returns {ValueFilter} A fully configured ValueFilter instance
   */
  public createValueFilter(valueDefinition: ValueDefinitionData): ValueFilter {
    const builder = this.initializeFilterBuilder(valueDefinition)
    const filtersBuilder = this.addFiltersToBuilder(valueDefinition, builder)
    return filtersBuilder.buildValueFilter()
  }

  /**
   * Adds the appropriate filters to the builder based on the attribute definition type.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition - The attribute or value definition containing filter configuration
   * @param {AttributeFiltersBuilder} builder - The AttributeFiltersBuilder to modify
   * @returns {AttributeFiltersBuilder} The modified AttributeFiltersBuilder with filters applied
   */
  public addFiltersToBuilder(
    attributeDefinition: AttributeDefinitionData | ValueDefinitionData,
    builder: AttributeFiltersBuilder
  ): AttributeFiltersBuilder {
    const type: FilterTypes = attributeDefinition.type
    switch (type) {
      case FilterTypes.CONCEPT:
        this.addConceptFilter(attributeDefinition, builder)
        break
      case FilterTypes.QUANTITY:
        this.addQuantityFilter(attributeDefinition, builder)
        break
      case FilterTypes.REFERENCE:
        this.addReferenceFilter(attributeDefinition, builder)
    }
    return builder
  }

  /**
   * Adds a concept filter to the builder based on the referenced value set.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition - The definition containing the referenced value set
   * @param {AttributeFiltersBuilder} builder - The builder to add the concept filter to
   * @returns void
   */
  private addConceptFilter(attributeDefinition: AttributeDefinitionData | ValueDefinitionData, builder: AttributeFiltersBuilder): void {
    const valueSet = attributeDefinition.referencedValueSet
    const conceptFilter = builder.buildConceptFilter(uuidv4(), valueSet)
    builder.withConceptFilter(conceptFilter)
  }

  /**
   * Adds a quantity filter to the builder with allowed units and precision.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition - The definition containing quantity filter configuration
   * @param {AttributeFiltersBuilder} builder - The builder to add the quantity filter to
   * @returns void
   */
  private addQuantityFilter(attributeDefinition: AttributeDefinitionData | ValueDefinitionData, builder: AttributeFiltersBuilder): void {
    const allowedUnits: QuantityUnit[] = this.getAllowedUnits(attributeDefinition.allowedUnits)
    const quantity = builder.buildQuantityFilter(allowedUnits, attributeDefinition.precision)
    builder.withQuantityFilter(quantity)
  }

  /**
   * Converts allowed unit data into QuantityUnit instances.
   * @param {QuantityUnitData[]} allowedUnits - Array of quantity unit data to convert
   * @returns {QuantityUnit[]} Array of QuantityUnit instances
   */
  private getAllowedUnits(allowedUnits: QuantityUnitData[]): QuantityUnit[] {
    return allowedUnits.map((unit: QuantityUnitData) => QuantityUnit.fromJson(unit))
  }

  /**
   * Adds a reference filter to the builder with referenced criteria set.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition - The attribute definition containing referenced criteria
   * @param {AttributeFiltersBuilder} builder - The builder to add the reference filter to
   * @returns void
   */
  private addReferenceFilter(attributeDefinition: AttributeDefinitionData | ValueDefinitionData, builder: AttributeFiltersBuilder): void {
    const referenceFilter = builder.buildReferenceFilter(uuidv4(), (attributeDefinition as AttributeDefinitionData).referencedCriteriaSet)
    builder.withReferenceFilter(referenceFilter)
  }

  /**
   * Initializes an AttributeFiltersBuilder with common properties from the definition.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition - The attribute or value definition to initialize from
   * @returns {AttributeFiltersBuilder} A new AttributeFiltersBuilder instance with display, optional flag, and type set
   */
  public initializeFilterBuilder(attributeDefinition: AttributeDefinitionData | ValueDefinitionData): AttributeFiltersBuilder {
    const builder = new AttributeFiltersBuilder(
      Display.fromJson(attributeDefinition.display),
      attributeDefinition.optional,
      attributeDefinition.type
    )
    return builder
  }
}
