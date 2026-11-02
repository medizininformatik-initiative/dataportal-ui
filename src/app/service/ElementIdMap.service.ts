import { Injectable } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { PossibleProfileReferenceData } from '../model/Interface/PossibleProfileReferenceData'

@Injectable({
  providedIn: 'root',
})
export class ElementIdMapService {
  /**
   * Creates a map from element id to an empty url list.
   * @param {DataSelectionProfile} profile
   * @returns {Map<string, string[]>}
   */
  public createUrlMap(profile: DataSelectionProfile): Map<string, string[]> {
    return this.buildElementIdMap(profile, () => [] as string[])
  }

  /**
   * Creates a map from element id to an empty url set.
   * @param {DataSelectionProfile} profile
   * @returns {Map<string, Set<string>>}
   */
  public createUrlSetMap(profile: DataSelectionProfile): Map<string, Set<string>> {
    return this.buildElementIdMap(profile, () => new Set<string>())
  }

  /**
   * Retrieves or creates a profile map for a given profile ID.
   * @param {Map<string, Map<string, string[]>>} currentMap - The current staged reference profile URLs map.
   * @param {string} profileId - The ID of the profile.
   * @returns {Map<string, string[]>} The profile map for the given profile ID.
   */
  public getOrCreateProfileMap(currentMap: Map<string, Map<string, string[]>>, profileId: string): Map<string, string[]> {
    const existing = currentMap.get(profileId) ?? new Map<string, string[]>()
    currentMap.set(profileId, existing)
    return existing
  }

  /**
   * Returns the url list of the element id and creates it if missing.
   * @param {Map<string, string[]>} profileMap
   * @param {string} elementId
   * @returns {string[]}
   */
  public getOrCreateFieldUrls(profileMap: Map<string, string[]>, elementId: string): string[] {
    const existing = profileMap.get(elementId) ?? []
    profileMap.set(elementId, existing)
    return existing
  }

  /**
   * Creates a map from element id to an empty list of possible references.
   * @param {DataSelectionProfile} profile
   * @returns {Map<string, PossibleProfileReferenceData[]>}
   */
  public createReferenceDataMap(profile: DataSelectionProfile): Map<string, PossibleProfileReferenceData[]> {
    return this.buildElementIdMap(profile, () => [] as PossibleProfileReferenceData[])
  }

  /**
   * Creates a map with one entry per field element id, filled with the factory value.
   * @param {DataSelectionProfile} profile
   * @param {() => T} factory
   * @returns {Map<string, T>}
   */
  private buildElementIdMap<T>(profile: DataSelectionProfile, factory: () => T): Map<string, T> {
    const map = new Map<string, T>()
    profile
      .getProfileFields()
      .getReferenceFields()
      .forEach((field: ReferenceField) => map.set(field.getElementId(), factory()))
    return map
  }
}
