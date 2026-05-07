import { Injectable } from '@angular/core';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField';
import { PossibleProfileReferenceData } from '../model/Interface/PossibleProfileReferenceData';

@Injectable({
  providedIn: 'root',
})
export class ElementIdMapService {
  public createUrlMap(profile: DataSelectionProfile): Map<string, string[]> {
    return this.buildElementIdMap(profile, () => [] as string[]);
  }

  public createUrlSetMap(profile: DataSelectionProfile): Map<string, Set<string>> {
    return this.buildElementIdMap(profile, () => new Set<string>());
  }

  /**
   * Retrieves or creates a profile map for a given profile ID.
   * @param currentMap - The current staged reference profile URLs map.
   * @param profileId - The ID of the profile.
   * @returns The profile map for the given profile ID.
   */
  public getOrCreateProfileMap(
    currentMap: Map<string, Map<string, string[]>>,
    profileId: string
  ): Map<string, string[]> {
    const existing = currentMap.get(profileId) ?? new Map<string, string[]>();
    currentMap.set(profileId, existing);
    return existing;
  }

  public getOrCreateFieldUrls(profileMap: Map<string, string[]>, elementId: string): string[] {
    const existing = profileMap.get(elementId) ?? [];
    profileMap.set(elementId, existing);
    return existing;
  }

  public createReferenceDataMap(
    profile: DataSelectionProfile
  ): Map<string, PossibleProfileReferenceData[]> {
    return this.buildElementIdMap(profile, () => [] as PossibleProfileReferenceData[]);
  }

  private buildElementIdMap<T>(profile: DataSelectionProfile, factory: () => T): Map<string, T> {
    const map = new Map<string, T>();
    profile
      .getProfileFields()
      .getReferenceFields()
      .forEach((field: ReferenceField) => map.set(field.getElementId(), factory()));
    return map;
  }
}
