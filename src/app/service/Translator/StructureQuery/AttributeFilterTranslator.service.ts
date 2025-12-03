import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData';
import { AttributeFiltersBuilder } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFiltersBuilder';
import { ConceptFilterTranslatorService } from './ConceptFilterTranslator.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { Injectable } from '@angular/core';
import { QuantityFilterTranslatorService } from './QuantityFilterTranslator.service';
import { ReferenceFilterTranslatorService } from './ReferenceFilterTranslator.service';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TerminologyCodeBaseData } from 'src/app/model/Interface/TerminologyBaseData';
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData';
import { AttributeFilterFactoryService } from '../../Criterion/AttributeFilterFactory.service';

@Injectable({
  providedIn: 'root',
})
export class AttributeFilterTranslatorService {
  constructor(
    private quantityFilterTranslatorService: QuantityFilterTranslatorService,
    private conceptFilterTranslatorService: ConceptFilterTranslatorService,
    private referenceFilterTranslatorService: ReferenceFilterTranslatorService,
    private attributeFilterFactoryService: AttributeFilterFactoryService
  ) {}

  /**
   * Translates the value filters from the structured query format to the internal format.
   * @param uiProfile
   * @param structuredQueryValueFilters
   * @returns
   */
  public translateValueFilters(
    valueDefinitionData: ValueDefinitionData,
    structuredQueryValueFilters: ValueFilterData
  ): ValueFilter {
    const attributeFilterBuilder = this.applyFilter(
      structuredQueryValueFilters,
      valueDefinitionData
    );
    return attributeFilterBuilder.buildValueFilter();
  }

  /**
   * Translates a list of attribute filters from the structured query format to the internal format.
   * @param uiProfile
   * @param structuredQueryAttributeFilters
   * @param parentId
   * @returns
   */
  public translateAttributeFilters(
    attributeDefinitionData: AttributeDefinitionData[],
    structuredQueryAttributeFilters: AttributeFilterData[],
    parentId: string
  ): AttributeFilter[] {
    return attributeDefinitionData.map((attributeFilter) =>
      this.translateAttributeFilter(attributeFilter, structuredQueryAttributeFilters, parentId)
    );
    //.filter((filter: AttributeFilter): filter is AttributeFilter => !!filter);
  }
  /**
   * Translates a single attribute filter from the structured query format to the internal format.
   * @param uiProfile
   * @param attributeFilterData
   * @param parentId
   * @returns
   */
  private translateAttributeFilter(
    attributeFilter: AttributeDefinitionData,
    SQData: AttributeFilterData[],
    parentId: string
  ): AttributeFilter {
    const foundAttributeDefinition: AttributeFilterData | undefined =
      this.findAttributeFilterInProfile(SQData ? SQData : [], attributeFilter.attributeCode);

    if (!foundAttributeDefinition) {
      return this.attributeFilterFactoryService.createAttributeFilter(attributeFilter);
    }
    const attributeFilterBuilder = this.applyFilter(
      foundAttributeDefinition,
      attributeFilter,
      parentId
    );

    attributeFilterBuilder.withAttributeCode(
      TerminologyCode.fromJson(foundAttributeDefinition.attributeCode)
    );
    return attributeFilterBuilder.buildAttributeFilter();
  }

  /**
   * Applies the appropriate filter translation based on the filter type for Attribute Filters and Value Filters.
   * @param attributeFilterBuilder
   * @param attributeFilterData
   * @param parentId - The id of the parent criterion, used for reference filters.
   * @param attributeDefinitionData
   * @returns
   */
  private applyFilter(
    attributeFilterData: AttributeFilterData | ValueFilterData,
    attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData,
    parentId?: string
  ): AttributeFiltersBuilder {
    const builder = this.createBuilderInstance(attributeDefinitionData);
    const type: FilterTypes = attributeDefinitionData.type;
    if (type === FilterTypes.CONCEPT) {
      const conceptFilter = this.conceptFilterTranslatorService.translate(
        attributeDefinitionData.referencedValueSet,
        attributeFilterData.selectedConcepts
      );
      return builder.withConceptFilter(conceptFilter);
    }
    if (type === FilterTypes.REFERENCE) {
      const referencedCriteriaSet: string[] = (attributeDefinitionData as AttributeDefinitionData)
        .referencedCriteriaSet;
      const attributeFilter = attributeFilterData as AttributeFilterData;
      const referenceFilter = this.referenceFilterTranslatorService.translate(
        parentId,
        attributeFilter.criteria,
        referencedCriteriaSet
      );
      return builder.withReferenceFilter(referenceFilter);
    }
    if (type === FilterTypes.QUANTITY) {
      const quantityFilter = this.quantityFilterTranslatorService.translate(
        attributeDefinitionData,
        attributeFilterData
      );
      return builder.withQuantityFilter(quantityFilter);
    }
  }

  /**
   * Creates an instance of the AttributeFiltersBuilder.
   * @param attributeDefinition
   * @returns
   */
  private createBuilderInstance(
    attributeDefinition: AttributeDefinitionData | ValueDefinitionData
  ): AttributeFiltersBuilder {
    return new AttributeFiltersBuilder(
      Display.fromJson(attributeDefinition.display),
      attributeDefinition.optional,
      attributeDefinition.type
    );
  }

  /**
   * Finds an attribute filter definition in the UI profile.
   * @param attributeDefinitions
   * @param attributeFilter
   * @returns
   */
  public findAttributeFilterInProfile(
    sq: AttributeFilterData[],
    attributeCode: TerminologyCodeBaseData
  ): AttributeFilterData | undefined {
    return sq.find((attributeDefinition: AttributeFilterData) => {
      const attributeCodeData = attributeDefinition.attributeCode;
      return (
        attributeCode.code === attributeCodeData.code &&
        attributeCode.system === attributeCodeData.system
      );
    });
  }
}
