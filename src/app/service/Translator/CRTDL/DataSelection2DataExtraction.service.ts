import { Injectable, inject } from '@angular/core'
import { AttributeGroup } from 'src/app/model/CRTDL/DataExtraction/AttributeGrooups/AttributeGroup'
import { AbstractAttributeGroupFilter } from 'src/app/model/CRTDL/DataExtraction/AttributeGrooups/AttributeGroup/AbstractAttributeGroupFilter'
import { Attributes } from 'src/app/model/CRTDL/DataExtraction/AttributeGrooups/AttributeGroup/Attributes/Attribute'
import { DateFilter } from 'src/app/model/CRTDL/DataExtraction/AttributeGrooups/AttributeGroup/Filter/DateFilter'
import { TokenFilter } from 'src/app/model/CRTDL/DataExtraction/AttributeGrooups/AttributeGroup/Filter/TokenFilter '
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { TerminologyCodeTranslator } from '../Shared/TerminologyCodeTranslator.service'
import { TimeRestrictionTranslationService } from '../Shared/TimeRestrictionTranslation.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelection2DataExtraction {
  private readonly timeRestrictionTranslation = inject(TimeRestrictionTranslationService)
  private readonly terminologyCodeTranslator = inject(TerminologyCodeTranslator)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translateToDataExtraction(dataSelection: DataSelection): DataExtraction {
    const attribuetGroups = dataSelection.getProfiles().map((profile: DataSelectionProfile) => this.translateAttributeGroups(profile))
    return attribuetGroups.length > 0 ? new DataExtraction(attribuetGroups) : undefined
  }

  private translateAttributeGroups(profile: DataSelectionProfile): AttributeGroup {
    const attributes = this.translateSelectedFields(profile.getProfileFields())
    const filters = this.translateFilters(profile.getFilters())
    const labelNumber = profile.getLabelNumber() > 0 ? ' (' + profile.getLabelNumber() + ')' : ''
    return new AttributeGroup(
      profile.getId(),
      profile.getUrl(),
      attributes,
      filters,
      profile.getLabel().getOriginal() + labelNumber,
      profile.getReference().getIsReferenceSet()
    )
  }

  /**
   * Translates the selected fields.
   * @todo its all broken -- need to be fixed
   * @param selectedFields
   * @returns {Attributes[] | undefined}
   * @param {ProfileFields} profileFields
   */
  private translateSelectedFields(profileFields: ProfileFields): Attributes[] | undefined {
    const selectedBasicFields = profileFields.getSelectedBasicFields()
    const selectedReferenceFields = profileFields.getSelectedReferenceFields()

    const basicFieldAttributes = selectedBasicFields.map(
      (selectedBasicField: SelectedBasicField) =>
        new Attributes(selectedBasicField.getElementId(), selectedBasicField.getMustHave(), undefined)
    )
    const referenceFieldAttributes = selectedReferenceFields.map(
      (selectedReferenceField: SelectedReferenceField) =>
        new Attributes(
          selectedReferenceField.getElementId(),
          selectedReferenceField.getMustHave(),
          selectedReferenceField.getLinkedProfileIds()
        )
    )
    const combinedAttributes = [...basicFieldAttributes, ...referenceFieldAttributes]
    return combinedAttributes.length > 0 ? combinedAttributes : undefined
  }

  private translateFilters(filters: AbstractProfileFilter[]): AbstractAttributeGroupFilter[] | undefined {
    const abstractProfileFilters: AbstractAttributeGroupFilter[] = []

    filters.forEach((filter: AbstractProfileFilter) => {
      const translatedFilter = this.getTranslatedFilter(filter)
      if (translatedFilter) {
        abstractProfileFilters.push(translatedFilter)
      }
    })

    return abstractProfileFilters.length > 0 ? abstractProfileFilters : undefined
  }

  private getTranslatedFilter(filter: AbstractProfileFilter): AbstractAttributeGroupFilter | undefined {
    switch (filter.getUiType()) {
      case DataSelectionUIType.TIMERESTRICTION:
        return this.translateDateFilter(filter as ProfileTimeRestrictionFilter)
      case DataSelectionUIType.CODE:
        return this.translateTokenFilter(filter as ProfileTokenFilter)
      default:
        return undefined
    }
  }

  private translateDateFilter(profileDateFilter: ProfileTimeRestrictionFilter): DateFilter | undefined {
    const time = this.timeRestrictionTranslation.translateTimeRestrictionToStructuredQuery(profileDateFilter.getTimeRestriction())
    return time
      ? new DateFilter(profileDateFilter.getName(), profileDateFilter.getType(), time.getAfterDate(), time.getBeforeDate())
      : undefined
  }

  private translateTokenFilter(profileTokenFilter: ProfileTokenFilter): TokenFilter | undefined {
    const selectedTokens = profileTokenFilter.getSelectedTokens()
    if (selectedTokens.length > 0) {
      const terminologyCodes = this.terminologyCodeTranslator.translateTermCodes(
        selectedTokens.map((token: Concept) => token.getTerminologyCode())
      )
      return new TokenFilter(profileTokenFilter.getName(), profileTokenFilter.getType(), terminologyCodes)
    } else {
      return undefined
    }
  }
}
