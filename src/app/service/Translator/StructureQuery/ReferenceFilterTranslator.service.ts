import { AttributeDefinitionData } from 'src/app/model/Interface/AttributeDefinitionData'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { AttributeFiltersBuilder } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFiltersBuilder'
import { ConceptFilterTranslatorService } from './ConceptFilterTranslator.service'
import { CriteriaProfileProviderService } from '../../Provider/CriteriaProfileProvider.service'
import { CriterionTranslatorService } from './CriterionTranslator.service'
import { CritGroupPosition } from 'src/app/model/FeasibilityQuery/CritGroupPosition'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { HashService } from '../../Hash.service'
import { inject, Injectable } from '@angular/core'
import { QuantityFilterTranslatorService } from './QuantityFilterTranslator.service'
import { ReferenceCriteriaData } from 'src/app/model/Interface/ReferenceCriteriaData'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { TimeRestrictionNotSet } from '../../../model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet'
import { UiProfileProviderService } from '../../Provider/UiProfileProvider.service'
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service'
import { v4 as uuidv4 } from 'uuid'
import { ValueDefinitionData } from 'src/app/model/Interface/ValueDefinition'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { TerminologyCodeBaseData } from 'src/app/model/Interface/TerminologyBaseData'

@Injectable({
  providedIn: 'root',
})
export class ReferenceFilterTranslatorService {
  private hashService = inject(HashService)
  private criteriaProfileProviderService = inject(CriteriaProfileProviderService)
  private referenceCriterionProviderService = inject(ReferenceCriterionProviderService)
  private uiTimeRestrictionFactoryService = inject(UITimeRestrictionFactoryService)
  private uiProfileProviderService = inject(UiProfileProviderService)
  private conceptFilterTranslatorService = inject(ConceptFilterTranslatorService)
  private quantityFilterTranslatorService = inject(QuantityFilterTranslatorService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Translates a reference filter.
   * @param parentId
   * @param criteria
   * @param referencedCriteriaSet
   * @returns
   */
  public translate(
    parentId: string,
    criteria: ReferenceCriteriaData[],
    referencedCriteriaSet: string[]
  ): ReferenceFilter {
    const referenceCriteria = this.createReferenceCriteria(parentId, criteria)
    const referenceFilter = this.createReferenceFilter(referencedCriteriaSet, referenceCriteria)
    this.referenceCriterionProviderService.setMany(referenceCriteria)
    return referenceFilter
  }

  /**
   * Creates a reference filter instance.
   * @param referencedCriteriaSet
   * @param referenceCriteria
   * @returns
   */
  private createReferenceFilter(
    referencedCriteriaSet: string[],
    referenceCriteria: ReferenceCriterion[]
  ): ReferenceFilter {
    return new ReferenceFilter(
      uuidv4(),
      referencedCriteriaSet,
      referenceCriteria.map((r) => r.getId())
    )
  }

  /**
   * Creates a reference criteria instance.
   * @param parentId
   * @param criteria
   * @returns
   */
  private createReferenceCriteria(
    parentId: string,
    criteria: ReferenceCriteriaData[]
  ): ReferenceCriterion[] {
    return criteria.map((referenceCriterion) =>
      this.createSingleReferenceCriterion(parentId, referenceCriterion)
    )
  }

  /**
   * Creates a single reference criterion instance.
   * @param parentId
   * @param referenceCriterion
   * @returns
   */
  private createSingleReferenceCriterion(
    parentId: string,
    referenceCriterion: ReferenceCriteriaData
  ): ReferenceCriterion {
    const termCode = TerminologyCode.fromJson(referenceCriterion.termCodes[0])
    const contextCode = TerminologyCode.fromJson(referenceCriterion.context)
    const hash = this.hashService.createCriterionHash(contextCode, termCode)
    const uiProfile = this.criteriaProfileProviderService.getCriteriaProfileByHash(hash)
    const uiProfileData = this.uiProfileProviderService.getOne(uiProfile?.uiProfileId ?? '')
    const attributeFilterForRefrence: AttributeFilter[] = []
    if (uiProfileData.attributeDefinitions.length > 0) {
      uiProfileData.attributeDefinitions.forEach((attributeDefinitionData) => {
        const testConcept = this.findAttributeFilterInProfile(
          referenceCriterion.attributeFilters,
          attributeDefinitionData.attributeCode
        )
        if (testConcept) {
          const builder = this.applyFilter(testConcept, attributeDefinitionData)
          builder.withAttributeCode(TerminologyCode.fromJson(testConcept.attributeCode))
          attributeFilterForRefrence.push(builder.buildAttributeFilter())
        }
      })
    }
    const timeRestriction = !referenceCriterion.timeRestriction
      ? new TimeRestrictionNotSet()
      : this.uiTimeRestrictionFactoryService.createTimeRestrictionForFeasibilityQuery(
          referenceCriterion.timeRestriction
        )

    return new ReferenceCriterion(
      parentId,
      true,
      attributeFilterForRefrence,
      contextCode,
      hash,
      Display.fromJson(uiProfile.display),
      false,
      new CritGroupPosition(),
      [termCode],
      timeRestriction,
      uuidv4(),
      []
    )
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
    attributeDefinitionData: AttributeDefinitionData | ValueDefinitionData
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
    if (type === FilterTypes.QUANTITY) {
      const quantityFilter = this.quantityFilterTranslatorService.translate(
        attributeDefinitionData,
        attributeFilterData
      )
      return builder.withQuantityFilter(quantityFilter)
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
    )
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
      const attributeCodeData = attributeDefinition.attributeCode
      return (
        attributeCode.code === attributeCodeData.code &&
        attributeCode.system === attributeCodeData.system
      )
    })
  }
}
