import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { AttributeFilterFactoryService } from './AttributeFilterFactory.service';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder';
import { CriterionMetadataService } from './CriterionMetadata.service';
import { Injectable } from '@angular/core';
import { UiProfileProviderService } from 'src/app/service/Provider/UiProfileProvider.service';
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class CriterionBuilderHelperService {
  constructor(
    private criterionMetadataService: CriterionMetadataService,
    private uiProfileProviderService: UiProfileProviderService,
    private attributeFilterFactory: AttributeFilterFactoryService
  ) {}

  public setBuilderWithCriteriaProfileData(profileData: CriteriaProfileData): CriterionBuilder {
    const mandatoryFields = this.criterionMetadataService.createMandatoryFields(profileData);
    const uiProfile = this.uiProfileProviderService.getUiProfileById(profileData.uiProfileId);
    const builder = new CriterionBuilder(mandatoryFields);
    const valueFilter = this.addValueFilters(uiProfile.valueDefinition);
    const attributeFilter = this.addAttributeFilters(uiProfile.attributeDefinitions);

    if (uiProfile.timeRestrictionAllowed) {
      builder.withTimeRestriction(builder.buildEmptyTimeRestriction());
    }
    builder.withValueFilters(valueFilter);
    builder.withAttributeFilters(attributeFilter);
    return builder;
  }

  /**
   * Adds attribute filters to the criterion builder.
   *
   * @param attributeDefinitions The attribute definitions to add as filters.
   * @param criterionBuilder The criterion builder to which attribute filters will be added.
   * @returns The modified CriterionBuilder.
   */
  private addAttributeFilters(
    attributeDefinitions: AttributeDefinitionData[]
  ): AttributeFilter[] | [] {
    if (attributeDefinitions.length > 0) {
      return attributeDefinitions.map((attributeDefinition: AttributeDefinitionData) =>
        this.attributeFilterFactory.createAttributeFilter(attributeDefinition)
      );
    }
  }

  /**
   * Adds value filters to the criterion builder.
   *
   * @param valueDefinitions The value definitions to add as filters.
   * @param criterionBuilder The criterion builder to which value filters will be added.
   * @returns The modified CriterionBuilder.
   */
  private addValueFilters(valueDefinition: ValueDefinitionData): ValueFilter[] | [] {
    if (valueDefinition) {
      return [this.attributeFilterFactory.createValueFilter(valueDefinition)];
    }
    return [];
  }
}
