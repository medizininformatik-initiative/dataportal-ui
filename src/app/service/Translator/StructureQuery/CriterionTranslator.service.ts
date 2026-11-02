import { inject, Injectable } from '@angular/core'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { v4 as uuidv4 } from 'uuid'
import { AttributeDefinitionData } from '../../../model/Interface/AttributeDefinitionData'
import { ValueDefinitionData } from '../../../model/Interface/ValueDefinition'
import { AttributeFilterFactoryService } from '../../Criterion/AttributeFilterFactory.service'
import { CriterionMetadataService } from '../../Criterion/CriterionMetadata.service'
import { HashService } from '../../Hash.service'
import { CriteriaProfileProviderService } from '../../Provider/CriteriaProfileProvider.service'
import { UiProfileProviderService } from '../../Provider/UiProfileProvider.service'
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service'
import { AttributeFilterTranslatorService } from './AttributeFilterTranslator.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionTranslatorService {
  private readonly attributeFilterTranslatorService = inject(AttributeFilterTranslatorService)
  private readonly criteriaProfileProviderService = inject(CriteriaProfileProviderService)
  private readonly criterionMetadataService = inject(CriterionMetadataService)
  private readonly hashService = inject(HashService)
  private readonly uiProfileProviderService = inject(UiProfileProviderService)
  private readonly uiTimeRestrictionFactoryService = inject(UITimeRestrictionFactoryService)
  private readonly attributeFilterFactoryService = inject(AttributeFilterFactoryService)

  constructor() {}

  /**
   * Translates a structured query criterion to a criterion.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   * @returns {Criterion}
   */
  public translate(structuredQueryCriterion: StructuredQueryCriterionData): Criterion {
    const criteriaProfileData = this.getCriteriaProfileData(structuredQueryCriterion)
    const criterionId = uuidv4()
    const termCodes = structuredQueryCriterion.termCodes.map((termCode) => TerminologyCode.fromJson(termCode))
    const criterionBuilder = this.createCriterionBuilder(criteriaProfileData, criterionId, termCodes)
    const uiProfile = this.uiProfileProviderService.getOne(criteriaProfileData.uiProfileId)
    this.applyValueFilters(criterionBuilder, structuredQueryCriterion, uiProfile.valueDefinition)

    this.applyValueFilters(criterionBuilder, structuredQueryCriterion, uiProfile.valueDefinition)
    this.applyAttributeFilters(criterionBuilder, structuredQueryCriterion, uiProfile.attributeDefinitions, criterionId)
    this.applyTimeRestriction(criterionBuilder, structuredQueryCriterion, uiProfile.timeRestrictionAllowed)
    return criterionBuilder.buildCriterion()
  }

  /**
   * Returns the criteria profile data for the term codes of the criterion.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   * @returns {CriteriaProfileData}
   */
  private getCriteriaProfileData(structuredQueryCriterion: StructuredQueryCriterionData): CriteriaProfileData {
    const termCodes = structuredQueryCriterion.termCodes.map((termCodeData) => TerminologyCode.fromJson(termCodeData))
    const context = TerminologyCode.fromJson(structuredQueryCriterion.context)
    const hash = this.hashService.createCriterionHash(context, termCodes[0])
    return this.criteriaProfileProviderService.getCriteriaProfileByHash(hash)
  }

  /**
   * Creates a criterion builder with the metadata of the profile.
   * @param {CriteriaProfileData} criteriaProfileData
   * @param {string} criterionId
   * @param {TerminologyCode[]} termCodes
   * @returns {CriterionBuilder}
   */
  private createCriterionBuilder(
    criteriaProfileData: CriteriaProfileData,
    criterionId: string,
    termCodes: TerminologyCode[]
  ): CriterionBuilder {
    const criterionMetadata = this.criterionMetadataService.createMandatoryFieldsFromData(criteriaProfileData, criterionId, termCodes)
    return new CriterionBuilder(criterionMetadata)
  }

  /**
   * Adds the value filters to the builder.
   * @param {CriterionBuilder} criterionBuilder
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   * @param {ValueDefinitionData} valueDefinition
   */
  private applyValueFilters(
    criterionBuilder: CriterionBuilder,
    structuredQueryCriterion: StructuredQueryCriterionData,
    valueDefinition: ValueDefinitionData
  ): void {
    if (!valueDefinition) {
      criterionBuilder.withValueFilters([])
    } else {
      if (!structuredQueryCriterion.valueFilter) {
        criterionBuilder.withValueFilters([this.attributeFilterFactoryService.createValueFilter(valueDefinition)])
        if (!valueDefinition.optional) {
          criterionBuilder.withRequiredFilter(false)
        }
      } else {
        const valueFilter: ValueFilter = this.attributeFilterTranslatorService.translateValueFilters(
          valueDefinition,
          structuredQueryCriterion.valueFilter
        )
        criterionBuilder.withValueFilters([valueFilter])
      }
    }
  }

  /**
   * Adds the attribute filters to the builder.
   * @param {CriterionBuilder} criterionBuilder
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   * @param {AttributeDefinitionData[]} attributeDefinitions
   * @param {string} criterionId
   */
  private applyAttributeFilters(
    criterionBuilder: CriterionBuilder,
    structuredQueryCriterion: StructuredQueryCriterionData,
    attributeDefinitions: AttributeDefinitionData[],
    criterionId: string
  ): void {
    const attributeFilters: AttributeFilter[] = this.attributeFilterTranslatorService.translateAttributeFilters(
      attributeDefinitions,
      structuredQueryCriterion.attributeFilters,
      criterionId
    )
    criterionBuilder.withAttributeFilters(attributeFilters)
  }
  /**
   * Adds the time restriction to the builder if one is set and allowed.
   * @param {CriterionBuilder} criterionBuilder
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   * @param {boolean} timeRestrictionAllowed
   */
  private applyTimeRestriction(
    criterionBuilder: CriterionBuilder,
    structuredQueryCriterion: StructuredQueryCriterionData,
    timeRestrictionAllowed: boolean
  ): void {
    if (!structuredQueryCriterion.timeRestriction) {
      if (timeRestrictionAllowed) {
        criterionBuilder.withTimeRestriction(criterionBuilder.buildEmptyTimeRestriction())
      }
    } else {
      const timeRestriction = this.uiTimeRestrictionFactoryService.createTimeRestrictionForFeasibilityQuery(
        structuredQueryCriterion.timeRestriction
      )

      criterionBuilder.withTimeRestriction(timeRestriction)
    }
  }
}
