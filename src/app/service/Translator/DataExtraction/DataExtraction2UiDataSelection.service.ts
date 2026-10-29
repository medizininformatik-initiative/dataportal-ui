import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap, tap } from 'rxjs'
import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData'
import { AttributesData } from 'src/app/model/Interface/AttributesData'
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData'
import { ProfileFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFieldsCloner'
import { v4 as uuidv4 } from 'uuid'
import { CodeableConceptApiService } from '../../Backend/Api/CodeableConceptApi.service'
import { LoadDataSelectionProfilesService } from '../../DataSelection/LoadDataSelectionProfiles.service'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service'
import { BasicFieldTranslatorService } from './BasicFieldTranslator.service'
import { ConceptHashCollectorService } from './ConceptHashCollector.service'
import { ProfileFilterTranslatorService } from './ProfileFilterTranslator.service'
import { ReferenceFieldTranslatorService } from './ReferenceFieldTranslator.service'

@Injectable({
  providedIn: 'root',
})
export class DataExtraction2UiDataSelectionService {
  private readonly createDataSelection = inject(LoadDataSelectionProfilesService)
  private readonly profileFilterTranslatorService = inject(ProfileFilterTranslatorService)
  private readonly basicFieldTranslator = inject(BasicFieldTranslatorService)
  private readonly referenceFieldTranslator = inject(ReferenceFieldTranslatorService)
  private readonly conceptHashCollector = inject(ConceptHashCollectorService)
  private readonly conceptTranslationCacheService = inject(ConceptTranslationCacheService)
  private readonly codeableConceptApiService = inject(CodeableConceptApiService)

  private idMap: { oldId: string; newId: string }[] = []

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  /**
   * Translates the given DataExtractionData into a DataSelection by fetching the necessary profile data and applying the relevant information from the DataExtractionData to the fetched profiles.
   * @param {DataExtractionData} dataExtraction
   * @returns {Observable<DataSelection>} An Observable that emits the translated DataSelection.
   */
  public translate(dataExtraction: DataExtractionData): Observable<DataSelection> {
    const hashes = this.conceptHashCollector.collectConceptHashes(dataExtraction)
    if (dataExtraction.attributeGroups?.length > 0) {
      const urls = this.getGroupReferences(dataExtraction)
      return this.createDataSelection.loadProfiles(urls, false).pipe(
        switchMap((profiles: DataSelectionProfile[]) => this.loadConcepts(profiles, hashes)),
        map((profiles: DataSelectionProfile[]) => this.buildDataSelection(profiles, dataExtraction))
      )
    }
  }

  private loadConcepts(profiles: DataSelectionProfile[], hashes: string[]): Observable<DataSelectionProfile[]> {
    return this.codeableConceptApiService.getCodeableConceptsByIds(hashes).pipe(
      tap((concepts) => this.conceptTranslationCacheService.setMany(concepts)),
      map(() => profiles)
    )
  }

  /**
   * Builds a DataSelection from the given profiles and DataExtractionData.
   * @param {DataSelectionProfile[]} profiles
   * @param {DataExtractionData} dataExtraction
   * @returns {DataSelection}
   */
  private buildDataSelection(profiles: DataSelectionProfile[], dataExtraction: DataExtractionData): DataSelection {
    this.replaceExternalIdsWithFetchedProfileIds(profiles, dataExtraction.attributeGroups)

    profiles.forEach((profile: DataSelectionProfile) => this.applyExternalProfile(profile, dataExtraction))

    return new DataSelection(profiles, uuidv4())
  }

  private applyExternalProfile(profile: DataSelectionProfile, dataExtraction: DataExtractionData): void {
    const externProfile = this.findExternalProfileFromIdMap(profile, dataExtraction)
    this.applyLabel(profile, externProfile)
    this.applyProfileFields(profile, externProfile)
    this.applyFilters(profile, externProfile)
    this.applyReference(profile, externProfile)
  }

  private applyLabel(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    if (externProfile.name) {
      const newLabel = this.parseTrailingNumber(externProfile.name)
      profile.setLabel(newLabel.text)
      profile.setLabelNumber(newLabel.number)
    } else {
      profile.setLabel(profile.getLabel().getOriginal())
      profile.setLabelNumber(0)
    }
  }

  private applyProfileFields(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    if (externProfile.attributes?.length > 0) {
      const updatedFields = this.setProfileFields(externProfile.attributes, profile.getProfileFields())
      profile.setProfileFields(updatedFields)
    } else {
      profile.getProfileFields().setSelectedBasicFields([])
    }
  }

  private applyFilters(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    if (TypeGuard.isFilterDataArray(externProfile.filter)) {
      const profileFilter = this.profileFilterTranslatorService.createProfileFilters(externProfile, profile)
      profile.setFilters(profileFilter)
    }
  }

  private applyReference(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    profile.setReference(new ProfileReference(true, externProfile.includeReferenceOnly ?? false))
  }

  private findExternalProfileFromIdMap(profile: DataSelectionProfile, dataExtraction: DataExtractionData): AttributeGroupsData | undefined {
    const idTupel = this.idMap.find((id) => id.newId === profile.getId())
    return dataExtraction.attributeGroups.find((externProfile) => externProfile.id === idTupel.oldId)
  }

  /**
   * Sets the profile fields of the given ProfileFields based on the provided attributes and returns a new instance of ProfileFields with the updated fields.
   * @param {AttributesData[]} attributes
   * @param {ProfileFields} profileFields
   * @returns {ProfileFields}
   */
  private setProfileFields(attributes: AttributesData[], profileFields: ProfileFields): ProfileFields {
    const selectedReferenceFields = this.referenceFieldTranslator.buildSelectedReferenceFields(attributes, profileFields, this.idMap)
    const selectedBasicFields = this.basicFieldTranslator.buildSelectedBasicFields(attributes, profileFields)

    profileFields.setSelectedReferenceFields([])
    profileFields.setSelectedBasicFields(selectedBasicFields)
    profileFields.setSelectedReferenceFields(selectedReferenceFields)

    return ProfileFieldsCloner.deepCopyProfileFields(profileFields)
  }

  private getGroupReferences(dataExtraction: DataExtractionData): string[] {
    return dataExtraction.attributeGroups.map((attributeGroup) => attributeGroup.groupReference)
  }

  /**
   * Replaces the old IDs in the idMap with the new IDs from the fetched profiles based on matching URLs between the DataSelectionProfiles and the AttributeGroupsData from the DataExtractionData. This allows for correct mapping of profile data to the corresponding profiles when applying the external profile data.
   * @param {DataSelectionProfile[]} dataSelectionProfiles
   * @param {AttributeGroupsData[]} externProfiles
   */
  private replaceExternalIdsWithFetchedProfileIds(
    dataSelectionProfiles: DataSelectionProfile[],
    externProfiles: AttributeGroupsData[]
  ): void {
    const remainingExternProfiles = [...externProfiles]
    this.idMap = []
    dataSelectionProfiles.forEach((profile) => {
      const url = profile.getUrl()
      const index = remainingExternProfiles.findIndex((extern) => extern.groupReference === url)

      if (index !== -1) {
        const matchedExtern = remainingExternProfiles.splice(index, 1)[0]
        this.idMap.push({ oldId: matchedExtern.id, newId: profile.getId() })
      }
    })
  }

  /**
   * Extracts the trailing number of the given text.
   *
   * @param {any} text
   * @returns {{ text: any; number: number; }}
   */
  public parseTrailingNumber(text) {
    const match = text.match(/^(.*) \((\d+)\)$/)

    if (!match) {
      return {
        text: text,
        number: null,
      }
    }

    return {
      text: match[1],
      number: Number(match[2]),
    }
  }
}
