import { Injectable } from '@angular/core';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';

@Injectable({
  providedIn: 'root',
})
export class CriteriaProfileProviderService {
  criteriaProfilesCache: Map<string, CriteriaProfileData> = new Map();
  constructor() {}

  /**
   *
   * @param hash
   * @returns
   */
  public getCriteriaProfileByHash(hash: string): CriteriaProfileData | undefined {
    return this.criteriaProfilesCache.get(hash);
  }

  public cacheCriteriaProfile(criteriaProfile: CriteriaProfileData): void {
    this.criteriaProfilesCache.set(criteriaProfile.id, criteriaProfile);
  }

  public setCachedCriteriaProfiles(criteriaProfiles: CriteriaProfileData[]): void {
    criteriaProfiles.forEach((profile: CriteriaProfileData) => this.cacheCriteriaProfile(profile));
  }
}
