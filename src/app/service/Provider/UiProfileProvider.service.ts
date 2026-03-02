import { Injectable } from '@angular/core';
import { UiProfileData } from 'src/app/model/Interface/UiProfileData';

@Injectable({
  providedIn: 'root',
})
export class UiProfileProviderService {
  private uiProfilesCache: Map<string, UiProfileData> = new Map();
  constructor() {}

  /**
   * Retrieves a UI profile by its ID.
   * @param id - The ID of the UI profile.
   * @returns - The UI profile data or undefined if not found.
   */
  public getUiProfileById(id: string): UiProfileData | undefined {
    return this.uiProfilesCache.get(id);
  }

  /**
   * Caches a UI profile by its ID.
   * @param id
   * @param uiProfile
   * @returns
   */
  public cacheUiProfile(id: string, uiProfile: UiProfileData): void {
    this.uiProfilesCache.set(id, uiProfile);
  }

  /**
   * Caches multiple UI profiles.
   * @param uiProfiles
   * @returns
   */
  public cacheUiProfiles(uiProfiles: UiProfileData[]): void {
    uiProfiles.forEach((profile: UiProfileData) => this.cacheUiProfile(profile.name, profile));
  }
}
