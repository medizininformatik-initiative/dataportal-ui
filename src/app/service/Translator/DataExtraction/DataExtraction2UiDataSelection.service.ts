import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { AttributesData } from 'src/app/model/Interface/AttributesData';
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { BasicFieldTranslatorService } from './BasicFieldTranslator.service';
import { ConceptHashCollectorService } from './ConceptHashCollector.service';
import { CreateDataSelectionProfileService } from '../../DataSelection/CreateDataSelectionProfile.service';
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData';
import { DataSelection } from 'src/app/model/DataSelection/DataSelection';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields';
import { ProfileFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFieldsCloner';
import { ProfileFilterTranslatorService } from './ProfileFilterTranslator.service';
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference';
import { ReferenceFieldTranslatorService } from './ReferenceFieldTranslator.service';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { v4 as uuidv4 } from 'uuid';
import { LoadDataSelectionProfilesService } from '../../DataSelection/LoadDataSelectionProfiles.service';
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service';
import { CodeableConceptApiService } from '../../Backend/Api/CodeableConceptApi.service';

@Injectable({
  providedIn: 'root',
})
export class DataExtraction2UiDataSelectionService {
  private idMap: { oldId: string; newId: string }[] = [];
  constructor(
    private createDataSelection: LoadDataSelectionProfilesService,
    private profileFilterTranslatorService: ProfileFilterTranslatorService,
    private basicFieldTranslator: BasicFieldTranslatorService,
    private referenceFieldTranslator: ReferenceFieldTranslatorService,
    private conceptHashCollector: ConceptHashCollectorService,
    private conceptTranslationCacheService: ConceptTranslationCacheService,
    private codeableConceptApiService: CodeableConceptApiService
  ) {}

  /**
   * Translates the given DataExtractionData into a DataSelection by fetching the necessary profile data and applying the relevant information from the DataExtractionData to the fetched profiles.
   * @param dataExtraction
   * @returns An Observable that emits the translated DataSelection.
   */
  public translate(dataExtraction: DataExtractionData): Observable<DataSelection> {
    const hashes = this.conceptHashCollector.collectConceptHashes(dataExtraction);
    if (dataExtraction.attributeGroups?.length > 0) {
      const urls = this.getGroupReferences(dataExtraction);
      return this.createDataSelection.fetchDataSelectionProfileData(urls, false).pipe(
        switchMap((profiles: DataSelectionProfile[]) => this.loadConcepts(profiles, hashes)),
        map((profiles: DataSelectionProfile[]) => this.buildDataSelection(profiles, dataExtraction))
      );
    }
  }

  private loadConcepts(
    profiles: DataSelectionProfile[],
    hashes: string[]
  ): Observable<DataSelectionProfile[]> {
    return this.codeableConceptApiService.getCodeableConceptsByIds(hashes).pipe(
      tap((concepts) => this.conceptTranslationCacheService.setConceptsByHash(concepts)),
      map(() => profiles)
    );
  }

  /**
   * Builds a DataSelection from the given profiles and DataExtractionData.
   * @param profiles
   * @param dataExtraction
   * @returns
   */
  private buildDataSelection(
    profiles: DataSelectionProfile[],
    dataExtraction: DataExtractionData
  ): DataSelection {
    this.replaceExternalIdsWithFetchedProfileIds(profiles, dataExtraction.attributeGroups);

    profiles.forEach((profile: DataSelectionProfile) =>
      this.applyExternalProfile(profile, dataExtraction)
    );

    return new DataSelection(profiles, uuidv4());
  }

  /**
   * @param profile
   * @param dataExtraction
   */
  private applyExternalProfile(
    profile: DataSelectionProfile,
    dataExtraction: DataExtractionData
  ): void {
    const externProfile = this.findExternalProfileFromIdMap(profile, dataExtraction);
    this.applyLabel(profile, externProfile);
    this.applyProfileFields(profile, externProfile);
    this.applyFilters(profile, externProfile);
    this.applyReference(profile, externProfile);
  }

  /**
   * @param profile
   * @param externProfile
   */
  private applyLabel(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    profile.setLabel(externProfile.name ?? profile.getLabel().getOriginal());
  }

  /**
   * @param profile
   * @param externProfile
   */
  private applyProfileFields(
    profile: DataSelectionProfile,
    externProfile: AttributeGroupsData
  ): void {
    if (externProfile.attributes?.length > 0) {
      const updatedFields = this.setProfileFields(
        externProfile.attributes,
        profile.getProfileFields()
      );
      profile.setProfileFields(updatedFields);
    } else {
      profile.getProfileFields().setSelectedBasicFields([]);
    }
  }

  /**
   * @param profile
   * @param externProfile
   */
  private applyFilters(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    if (TypeGuard.isFilterDataArray(externProfile.filter)) {
      const profileFilter = this.profileFilterTranslatorService.createProfileFilters(
        externProfile,
        profile
      );
      profile.setFilters(profileFilter);
    }
  }

  /**
   * @param profile
   * @param externProfile
   */
  private applyReference(profile: DataSelectionProfile, externProfile: AttributeGroupsData): void {
    profile.setReference(new ProfileReference(true, externProfile.includeReferenceOnly ?? false));
  }

  /**
   * @param profile
   * @param dataExtraction
   * @returns
   */
  private findExternalProfileFromIdMap(
    profile: DataSelectionProfile,
    dataExtraction: DataExtractionData
  ): AttributeGroupsData | undefined {
    const idTupel = this.idMap.find((id) => id.newId === profile.getId());
    return dataExtraction.attributeGroups.find(
      (externProfile) => externProfile.id === idTupel.oldId
    );
  }

  /**
   * Sets the profile fields of the given ProfileFields based on the provided attributes and returns a new instance of ProfileFields with the updated fields.
   * @param attributes
   * @param profileFields
   * @returns
   */
  private setProfileFields(
    attributes: AttributesData[],
    profileFields: ProfileFields
  ): ProfileFields {
    const selectedReferenceFields = this.referenceFieldTranslator.buildSelectedReferenceFields(
      attributes,
      profileFields,
      this.idMap
    );
    const selectedBasicFields = this.basicFieldTranslator.buildSelectedBasicFields(
      attributes,
      profileFields
    );

    profileFields.setSelectedReferenceFields([]);
    profileFields.setSelectedBasicFields(selectedBasicFields);
    profileFields.setSelectedReferenceFields(selectedReferenceFields);

    return ProfileFieldsCloner.deepCopyProfileFields(profileFields);
  }

  private getGroupReferences(dataExtraction: DataExtractionData): string[] {
    return dataExtraction.attributeGroups.map((attributeGroup) => attributeGroup.groupReference);
  }

  /**
   * Replaces the old IDs in the idMap with the new IDs from the fetched profiles based on matching URLs between the DataSelectionProfiles and the AttributeGroupsData from the DataExtractionData. This allows for correct mapping of profile data to the corresponding profiles when applying the external profile data.
   * @param dataSelectionProfiles
   * @param externProfiles
   */
  private replaceExternalIdsWithFetchedProfileIds(
    dataSelectionProfiles: DataSelectionProfile[],
    externProfiles: AttributeGroupsData[]
  ): void {
    const remainingExternProfiles = [...externProfiles];

    dataSelectionProfiles.forEach((profile) => {
      const url = profile.getUrl();
      const index = remainingExternProfiles.findIndex((extern) => extern.groupReference === url);

      if (index !== -1) {
        const matchedExtern = remainingExternProfiles.splice(index, 1)[0];
        this.idMap.push({ oldId: matchedExtern.id, newId: profile.getId() });
      }
    });
  }
}
