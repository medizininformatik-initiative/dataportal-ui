import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProviderService } from '../modules/data-selection/services/DataSelectionProvider.service';
import { ElementIdMapService } from './ElementIdMap.service';
import { Injectable } from '@angular/core';
import { LoadDataSelectionProfilesService } from './DataSelection/LoadDataSelectionProfiles.service';
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData';
import { ProfileProviderService } from './Provider/ProfileProvider.service';

@Injectable({
  providedIn: 'root',
})
export class PossibleReferencesService {
  /**
   * id vom profile --> elementId --> PossibleProfileReferenceData Array
   */
  private possibleReferencesMapSubject = new BehaviorSubject<
    Map<string, Map<string, PossibleProfileReferenceData[]>>
  >(new Map());

  constructor(
    private loadDataSelectionProfilesService: LoadDataSelectionProfilesService,
    private dataSelectionProviderService: DataSelectionProviderService,
    private elementIdMapService: ElementIdMapService,
    private profileProviderService: ProfileProviderService
  ) {}

  public initialize(profileId: string): Observable<void> {
    const profile = this.profileProviderService.getOne(profileId);
    const initialMap = new Map<string, Map<string, PossibleProfileReferenceData[]>>();
    const elementIdMap = this.elementIdMapService.createReferenceDataMap(profile);
    initialMap.set(profileId, elementIdMap);
    this.updateReferencesMap(initialMap);
    return this.rebuildPossibleReferences(profile);
  }

  /**
   * Updates the staged reference profile URLs map.
   * @param updatedMap - The updated map to set.
   */
  public updateReferencesMap(
    updatedMap: Map<string, Map<string, PossibleProfileReferenceData[]>>
  ): void {
    this.possibleReferencesMapSubject.next(new Map(updatedMap));
  }

  public rebuildPossibleReferences(parentProfile: DataSelectionProfile): Observable<void> {
    return this.dataSelectionProviderService.getProfilesFromActiveDataSelection().pipe(
      take(1),
      map((dataSelectionProfiles) => {
        const baseMap = new Map<string, Map<string, PossibleProfileReferenceData[]>>(
          this.possibleReferencesMapSubject.value
        );
        dataSelectionProfiles.forEach((profile) => {
          const id = profile.getId();
          const referencedFields = parentProfile.getProfileFields().getReferenceFields();
          const existingElementMap =
            baseMap.get(id) ?? new Map<string, PossibleProfileReferenceData[]>();
          const newElementMap = new Map<string, PossibleProfileReferenceData[]>();

          existingElementMap.forEach((_oldRefs, elementId) => {
            const fieldDef = referencedFields.find((f) => f.getElementId() === elementId);
            const urls =
              fieldDef
                ?.getReferencedProfiles()
                .map((referencedProfile) => referencedProfile.getUrl()) ?? [];
            const linkedIds = this.getLinkedProfileIds(parentProfile, elementId);
            const existing = this.getExistingProfilesByUrls(urls, id, dataSelectionProfiles);
            newElementMap.set(elementId, this.mapProfilesWithSelectionState(existing, linkedIds));
          });
          baseMap.set(id, newElementMap);
        });
        return baseMap;
      }),
      tap((updatedMap) => this.possibleReferencesMapSubject.next(updatedMap)),
      map(() => void 0)
    );
  }

  /**
   * Public getter for the possibleReferencesMap$ observable.
   * @returns An observable of the possible references map.
   */
  public getReferencesMap(): Observable<Map<string, Map<string, PossibleProfileReferenceData[]>>> {
    return this.possibleReferencesMapSubject.asObservable();
  }

  public getLinkedProfileIds(parentProfile: DataSelectionProfile, elementId: string): string[] {
    const matchedField = parentProfile
      .getProfileFields()
      .getSelectedReferenceFields()
      ?.find((field) => field.getElementId() === elementId);
    return matchedField?.getLinkedProfileIds() ?? [];
  }

  /**
   * Retrieves existing profiles by matching URLs and excluding the current profile.
   * @param urls - The list of URLs to match.
   * @param profileId - The ID of the current profile to exclude.
   * @param profileMap - A map of profile IDs to profiles.
   * @returns A list of matching profiles.
   */
  private getExistingProfilesByUrls(
    urls: string[],
    profileId: string,
    profileMap: DataSelectionProfile[]
  ): DataSelectionProfile[] {
    return profileMap
      .filter((profile) => urls.includes(profile.getUrl()))
      .filter((profile) => profile.getId() !== profileId);
  }

  /**
   * Second use-case for exiting profiles
   * Maps profiles to possible reference data objects.
   * @param profiles - The profiles to map.
   * @returns A list of possible profile references.
   */
  private mapProfilesWithSelectionState(
    profiles: DataSelectionProfile[],
    linkedIds: string[]
  ): PossibleProfileReferenceData[] {
    return profiles.map((profile) => {
      const isSelected = linkedIds.length > 0 && linkedIds.includes(profile.getId());
      return this.mapProfileToReference(profile, isSelected);
    });
  }

  /**
   * Maps a profile to a possible reference data object.
   * @param profile - The profile to map.
   * @returns A `PossibleProfileReferenceData` object.
   */
  private mapProfileToReference(
    profile: DataSelectionProfile,
    isSelected: boolean
  ): PossibleProfileReferenceData {
    return {
      id: profile.getId(),
      label: profile.getLabel().getOriginal(),
      display: profile.getDisplay(),
      url: profile.getUrl(),
      isSelected,
    };
  }

  /**
   * First use-case for newly selected profiles
   * Maps URLs to possible reference data objects.
   * @param urls - The URLs to map.
   * @returns A list of possible profile references.
   */
  private mapProfilesToReferences(
    profiles: DataSelectionProfile[]
  ): PossibleProfileReferenceData[] {
    return profiles.map((profile) => this.mapProfileToReference(profile, true));
  }

  public loadAndMapProfiles(
    urls: string[],
    elementId: string,
    parentProfileId: string
  ): Observable<PossibleProfileReferenceData[]> {
    return this.loadDataSelectionProfilesService.loadProfiles(urls, true).pipe(
      map((profiles: DataSelectionProfile[]) => {
        this.dataSelectionProviderService.setProfilesInActiveDataSelection(profiles);
        const possibleReferences = this.mapProfilesToReferences(profiles);
        const currentMap = this.possibleReferencesMapSubject.getValue();
        const existingReferences = currentMap.get(parentProfileId)?.get(elementId) ?? [];
        const updatedReferences = [...existingReferences, ...possibleReferences];
        this.updateNestedMap(parentProfileId, elementId, updatedReferences);
        return updatedReferences;
      })
    );
  }

  public clearReferencesMap(): void {
    this.possibleReferencesMapSubject.next(new Map());
  }

  private updateNestedMap(
    profileId: string,
    elementId: string,
    references: PossibleProfileReferenceData[]
  ): void {
    const currentMap = this.possibleReferencesMapSubject.getValue();
    const outerMap = new Map(
      currentMap.get(profileId) ?? new Map<string, PossibleProfileReferenceData[]>()
    );
    outerMap.set(elementId, references);
    const updatedMap = new Map(currentMap);
    updatedMap.set(profileId, outerMap);
    this.possibleReferencesMapSubject.next(updatedMap);
  }

  /**
   * Sets a specific element in the possibleReferencesMap.
   * @param profileId - The ID of the profile.
   * @param elementId - The ID of the element.
   * @param possibleReferences - The array of possible profile reference data to set.
   */
  public setReferencesMapElement(
    profileId: string,
    elementId: string,
    possibleReferences: PossibleProfileReferenceData[]
  ): void {
    this.updateNestedMap(profileId, elementId, possibleReferences);
  }
}
