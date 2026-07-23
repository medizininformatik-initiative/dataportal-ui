import { BehaviorSubject, map, Observable, tap } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { Injectable, inject } from '@angular/core'
import { ProfileProviderService } from './Provider/ProfileProvider.service'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { SelectedReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ProfileTimeRestrictionFilter } from '../model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from '../model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { initial } from 'lodash'

/**
 * Service for managing staged profile changes before committing to data selection.
 * Provides methods to update profile fields, filters, and references in a staged manner.
 */
@Injectable({
  providedIn: 'root',
})
export class StagedProfileService {
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private profileProviderService = inject(ProfileProviderService)

  private stagedProfile: DataSelectionProfile

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public initialize(profile: DataSelectionProfile): void {
    this.stagedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
  }
  /**
   * Updates the selected basic fields in the staged profile.
   * @param selectedBasicFields - The selected basic fields to set
   * @returns
   */
  public updateSelectedBasicFields(selectedBasicFields: SelectedBasicField[]): void {
    const profile = this.stagedProfile
    if (profile) {
      profile.getProfileFields().setSelectedBasicFields(selectedBasicFields)
      this.buildProfile()
    }
  }

  /**
   * Updates the selected reference fields in the staged profile.
   * @param selectedReferenceFields - The selected reference fields to set
   * @returns
   */
  public updateSelectedReferenceFields(selectedReferenceFields: SelectedReferenceField[]): void {
    const profile = this.stagedProfile
    if (profile) {
      profile.getProfileFields().setSelectedReferenceFields(selectedReferenceFields)
      this.setLinkedProfillesInDataSelectionProvdier()
      this.buildProfile()
    }
  }

  public updateProfileFilter(filter: ProfileTokenFilter | ProfileTimeRestrictionFilter): void {
    const profile = this.stagedProfile
    if (profile) {
      profile.setFilter(filter)
      this.buildProfile()
    }
  }

  /**
   * Updates the label of the staged profile.
   * @param label - The new label text
   * @returns
   */
  public updateLabel(label: string): void {
    const profile = this.stagedProfile
    if (profile) {
      profile.setLabel(label)
      this.buildProfile()
    }
  }
  /**
   * Sets linked profiles in the data selection provider.
   * @returns Observable of void array for completion tracking
   * @private
   */
  private setLinkedProfillesInDataSelectionProvdier(): Observable<void[]> {
    const profile = this.stagedProfile
    if (profile) {
      const selectedReferenceFields = [...profile.getProfileFields().getSelectedReferenceFields()]
      const linkedProfileIds = this.getReferencedProfileIds(selectedReferenceFields)
      return this.getProfilesFromProviderAndSetInDataSelection(linkedProfileIds)
    }
  }

  /**
   * Gets profiles from the provider and sets them in data selection.
   * @param linkedProfileIds - Array of profile IDs to retrieve
   * @returns Observable of void array for completion tracking
   * @private
   */
  private getProfilesFromProviderAndSetInDataSelection(
    linkedProfileIds: string[]
  ): Observable<void[]> {
    return this.profileProviderService.getAll().pipe(
      map((profileArray: Array<DataSelectionProfile>) =>
        linkedProfileIds.map((id) => {
          const profile = profileArray.find((p) => p.getId() === id)
          if (profile) {
            return this.setProfileInDataSelectionProvider(profile)
          }
        })
      )
    )
  }

  /**
   * Extracts referenced profile IDs from selected reference fields.
   * @param selectedReferenceFields - Selected reference fields
   * @returns Array of referenced profile IDs
   * @private
   */
  private getReferencedProfileIds(selectedReferenceFields: SelectedReferenceField[]): string[] {
    const linkedProfileIds = selectedReferenceFields
      .map((selectedReferenceField) => selectedReferenceField.getLinkedProfileIds())
      .reduce((acc, ids) => acc.concat(ids), [])
    return linkedProfileIds
  }

  /**
   * Builds and saves the staged profile to providers and data selection.
   * @returns Observable of void array for completion tracking
   */
  public buildProfile(): Observable<void[]> {
    const profile = this.stagedProfile
    this.stagedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.profileProviderService.setOne(profile)
    this.setProfileInDataSelectionProvider(profile)
    return this.setLinkedProfillesInDataSelectionProvdier()
  }

  /**
   * Sets a profile in the active data selection.
   * @param profile - The profile to set
   * @returns
   * @private
   */
  private setProfileInDataSelectionProvider(profile: DataSelectionProfile): void {
    this.dataSelectionProviderService.setProfileInActiveDataSelection(profile)
  }
}
