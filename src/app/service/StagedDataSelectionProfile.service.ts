import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { Injectable, OnDestroy, inject } from '@angular/core'
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
export class StagedProfileService implements OnDestroy {
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private profileProviderService = inject(ProfileProviderService)

  private stagedProfile: DataSelectionProfile
  private subscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

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
    this.subscription?.unsubscribe()
    const profile = this.stagedProfile

    if (profile) {
      let profiles: DataSelectionProfile[] = []
      this.profileProviderService
        .getAll()
        .subscribe((profiles_) => {
          profiles = profiles_
        })
        .unsubscribe()

      const newLabel = this.parseTrailingNumber(label)

      const sameProfiles = profiles.filter(
        (existingProfile) =>
          existingProfile.getLabel().getOriginal() === newLabel.text ||
          existingProfile.getLabel().getTranslations()[0].getValue() === newLabel.text ||
          existingProfile.getLabel().getTranslations()[1].getValue() === newLabel.text
      )

      if (sameProfiles.length === 0) {
        if (newLabel.number !== null) {
          profile.setLabelNumber(newLabel.number)
        } else {
          profile.setLabelNumber(0)
        }
      } else {
        if (newLabel.number !== null) {
          const foundProfile = sameProfiles.find(
            (existingProfile) => existingProfile.getLabelNumber() === newLabel.number
          )
          if (foundProfile) {
            if (foundProfile.getId() !== profile.getId()) {
              sameProfiles.sort(function (a, b) {
                return b.getLabelNumber() - a.getLabelNumber()
              })
              const newLabelNumber = sameProfiles[0].getLabelNumber() + 1
              profile.setLabelNumber(newLabelNumber)
            }
          } else {
            profile.setLabelNumber(newLabel.number)
          }
        }
      }
      profile.setLabel(newLabel.text)
      this.buildProfile()
    }
  }

  parseTrailingNumber(text) {
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
    this.dataSelectionProviderService.setActiveProfile(profile, 'SET')
  }
}
