import { Injectable } from '@angular/core'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'

@Injectable({
  providedIn: 'root',
})
export class CriteriaProfileProviderService {
  public criteriaProfilesCache: Map<string, CriteriaProfileData> = new Map()
  constructor() {}

  /**
   * Returns the cached criteria profile for the hash.
   * @param {string} hash
   * @returns {CriteriaProfileData | undefined}
   */
  public getCriteriaProfileByHash(hash: string): CriteriaProfileData | undefined {
    return this.criteriaProfilesCache.get(hash)
  }

  /**
   * Stores the criteria profile in the cache.
   * @param {CriteriaProfileData} criteriaProfile
   */
  public cacheCriteriaProfile(criteriaProfile: CriteriaProfileData): void {
    this.criteriaProfilesCache.set(criteriaProfile.id, criteriaProfile)
  }

  /**
   * Stores the criteria profiles in the cache.
   * @param {CriteriaProfileData[]} criteriaProfiles
   */
  public setCachedCriteriaProfiles(criteriaProfiles: CriteriaProfileData[]): void {
    criteriaProfiles.forEach((profile: CriteriaProfileData) => this.cacheCriteriaProfile(profile))
  }
}
