import { inject, Injectable } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { AttributeFiltersBuilder } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFiltersBuilder'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { TerminologyCodeBaseData } from 'src/app/model/Interface/TerminologyBaseData'
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AttributeFilterFactoryService } from '../../Criterion/AttributeFilterFactory.service'
import { ConceptFilterTranslatorService } from './ConceptFilterTranslator.service'
import { QuantityFilterTranslatorService } from './QuantityFilterTranslator.service'
import { ReferenceFilterTranslatorService } from './ReferenceFilterTranslator.service'

@Injectable({
  providedIn: 'root',
})
export class AttributeFilterTranslatorService {
  private readonly quantityFilterTranslatorService = inject(QuantityFilterTranslatorService)
  private readonly conceptFilterTranslatorService = inject(ConceptFilterTranslatorService)
  private readonly referenceFilterTranslatorService = inject(ReferenceFilterTranslatorService)
  private readonly attributeFilterFactoryService = inject(AttributeFilterFactoryService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Translates the value filters from the structured query format to the internal format.
   * @param uiProfile
   * @param {ValueFilterData} structuredQueryValueFilters
   * @returns {ValueFilter}
   * @param {ValueDefinitionData} valueDefinitionData
   */
  public translateValueFilters(valueDefinitionData: ValueDefinitionData, structuredQueryValueFilters: ValueFilterData): ValueFilter {
    const attributeFilterBuilder = this.applyFilter(structuredQueryValueFilters, valueDefinitionData)
    return attributeFilterBuilder.buildValueFilter()
  }

  /**
   * Translates a list of attribute filters from the structured query format to the internal format.
   * @param uiProfile
   * @param {AttributeFilterData[]} structuredQueryAttributeFilters
   * @param {string} parentId
   * @returns {AttributeFilter[]}
   * @param {AttributeDefinitionData[]} attributeDefinitionData
   */
  public translateAttributeFilters(
    attributeDefinitionData: AttributeDefinitionData[],
    structuredQueryAttributeFilters: AttributeFilterData[],
    parentId: string
  ): AttributeFilter[] {
    return attributeDefinitionData.map((attributeFilter) =>
      this.translateAttributeFilter(attributeFilter, structuredQueryAttributeFilters, parentId)
    )
    //.filter((filter: AttributeFilter): filter is AttributeFilter => !!filter);
  }
  /**
   * Translates a single attribute filter from the structured query format to the internal format.
   * @param uiProfile
   * @param attributeFilterData
   * @param {string} parentId
   * @returns {AttributeFilter}
   * @param {AttributeDefinitionData} attributeFilter
   * @param {AttributeFilterData[]} SQData
   */
  private translateAttributeFilter(
    attributeFilter: AttributeDefinitionData,
    SQData: AttributeFilterData[],
    parentId: string
  ): AttributeFilter {
    const foundAttributeDefinition: AttributeFilterData | undefined = this.findAttributeFilterInProfile(
      SQData ? SQData : [],
      attributeFilter.attributeCode
    )

    if (!foundAttributeDefinition) {
      return this.attributeFilterFactoryService.createAttributeFilter(attributeFilter)
    }
    const attributeFilterBuilder = this.applyFilter(foundAttributeDefinition, attributeFilter, parentId)

    attributeFilterBuilder.withAttributeCode(TerminologyCode.fromJson(foundAttributeDefinition.attributeCode))
    return attributeFilterBuilder.buildAttributeFilter()
  }

  /**
   * Applies the appropriate filter translation based on the filter type for Attribute Filters and Value Filters.
   * @param attributeFilterBuilder
   * @param {AttributeFilterData | ValueFilterData} attributeFilterData
   * @param {string} parentId - The id of the parent criterion, used for reference filters.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinitionData
   * @returns {AttributeFiltersBuilder}
   */
  private applyFilter(
    attributeFilterData: AttributeFilterData | ValueFilterData,
    attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData,
    parentId?: string
  ): AttributeFiltersBuilder {
    const builder = this.createBuilderInstance(attributeDefinitionData)
    const type: FilterTypes = attributeDefinitionData.type
    if (type === FilterTypes.CONCEPT) {
      const conceptFilter = this.conceptFilterTranslatorService.translate(
        attributeDefinitionData.referencedValueSet,
        attributeFilterData.selectedConcepts
      )
      return builder.withConceptFilter(conceptFilter)
    }
    if (type === FilterTypes.REFERENCE) {
      const referencedCriteriaSet: string[] = (attributeDefinitionData as AttributeDefinitionData).referencedCriteriaSet
      const attributeFilter = attributeFilterData as AttributeFilterData
      const referenceFilter = this.referenceFilterTranslatorService.translate(parentId, attributeFilter.criteria, referencedCriteriaSet)
      return builder.withReferenceFilter(referenceFilter)
    }
    if (type === FilterTypes.QUANTITY) {
      const quantityFilter = this.quantityFilterTranslatorService.translate(attributeDefinitionData, attributeFilterData)
      return builder.withQuantityFilter(quantityFilter)
    }
  }

  /**
   * Creates an instance of the AttributeFiltersBuilder.
   * @param {AttributeDefinitionData | ValueDefinitionData} attributeDefinition
   * @returns {AttributeFiltersBuilder}
   */
  private createBuilderInstance(attributeDefinition: AttributeDefinitionData | ValueDefinitionData): AttributeFiltersBuilder {
    return new AttributeFiltersBuilder(
      Display.fromJson(attributeDefinition.display),
      attributeDefinition.optional,
      attributeDefinition.type
    )
  }

  /**
   * Finds an attribute filter definition in the UI profile.
   * @param attributeDefinitions
   * @param attributeFilter
   * @returns {AttributeFilterData | undefined}
   * @param {AttributeFilterData[]} sq
   * @param {TerminologyCodeBaseData} attributeCode
   */
  public findAttributeFilterInProfile(sq: AttributeFilterData[], attributeCode: TerminologyCodeBaseData): AttributeFilterData | undefined {
    return sq.find((attributeDefinition: AttributeFilterData) => {
      const attributeCodeData = attributeDefinition.attributeCode
      return attributeCode.code === attributeCodeData.code && attributeCode.system === attributeCodeData.system
    })
  }
}
