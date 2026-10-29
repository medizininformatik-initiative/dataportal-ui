import { Injectable, inject } from '@angular/core'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder'
import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { UiProfileData } from 'src/app/model/Interface/UiProfileData'
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition'
import { UiProfileProviderService } from 'src/app/service/Provider/UiProfileProvider.service'
import { AttributeFilterFactoryService } from './AttributeFilterFactory.service'
import { CriterionMetadataService } from './CriterionMetadata.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionBuilderHelperService {
  private readonly criterionMetadataService = inject(CriterionMetadataService)
  private readonly uiProfileProviderService = inject(UiProfileProviderService)
  private readonly attributeFilterFactory = inject(AttributeFilterFactoryService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public setBuilderWithCriteriaProfileData(profileData: CriteriaProfileData): CriterionBuilder {
    const mandatoryFields = this.criterionMetadataService.createMandatoryFields(profileData)
    const uiProfile = this.uiProfileProviderService.getOne(profileData.uiProfileId)
    const builder = new CriterionBuilder(mandatoryFields)
    const valueFilter = this.addValueFilters(uiProfile.valueDefinition)
    const attributeFilter = this.addAttributeFilters(uiProfile.attributeDefinitions)

    if (uiProfile.timeRestrictionAllowed) {
      builder.withTimeRestriction(builder.buildEmptyTimeRestriction())
    }
    builder.withValueFilters(valueFilter)
    builder.withAttributeFilters(attributeFilter)
    builder.withRequiredFilter(this.setIsRequiredFilterSet(uiProfile))
    return builder
  }

  private setIsRequiredFilterSet(uiProfile: UiProfileData): boolean {
    if (uiProfile.attributeDefinitions.length > 0) {
      return !uiProfile.attributeDefinitions.some((attributeDefinition: AttributeDefinitionData) => !attributeDefinition.optional)
    } else if (uiProfile.valueDefinition) {
      return uiProfile.valueDefinition.optional
    } else {
      return true
    }
  }

  /**
   * Adds attribute filters to the criterion builder.
   *
   * @param {AttributeDefinitionData[]} attributeDefinitions The attribute definitions to add as filters.
   * @param criterionBuilder The criterion builder to which attribute filters will be added.
   * @returns {AttributeFilter[] | []} The modified CriterionBuilder.
   */
  private addAttributeFilters(attributeDefinitions: AttributeDefinitionData[]): AttributeFilter[] | [] {
    if (attributeDefinitions.length > 0) {
      return attributeDefinitions.map((attributeDefinition: AttributeDefinitionData) =>
        this.attributeFilterFactory.createAttributeFilter(attributeDefinition)
      )
    }
  }

  /**
   * Adds value filters to the criterion builder.
   *
   * @param valueDefinitions The value definitions to add as filters.
   * @param criterionBuilder The criterion builder to which value filters will be added.
   * @returns {ValueFilter[] | []} The modified CriterionBuilder.
   * @param {ValueDefinitionData} valueDefinition
   */
  private addValueFilters(valueDefinition: ValueDefinitionData): ValueFilter[] | [] {
    if (valueDefinition) {
      return [this.attributeFilterFactory.createValueFilter(valueDefinition)]
    }
    return []
  }
}
