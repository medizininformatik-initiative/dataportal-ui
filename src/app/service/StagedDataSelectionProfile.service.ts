import { Injectable, OnDestroy, inject } from '@angular/core'
import { initial } from 'lodash'
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { SelectedReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ProfileTimeRestrictionFilter } from '../model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from '../model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { ProfileProviderService } from './Provider/ProfileProvider.service'

/**
 * Service for managing staged profile changes before committing to data selection.
 * Provides methods to update profile fields, filters, and references in a staged manner.
 */
@Injectable({
  providedIn: 'root',
})
export class StagedProfileService implements OnDestroy {
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly profileProviderService = inject(ProfileProviderService)

  private stagedProfile: DataSelectionProfile
  private readonly subscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  public initialize(profile: DataSelectionProfile): void {
    this.stagedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
  }
  /**
   * Updates the selected basic fields in the staged profile.
   * @param {SelectedBasicField[]} selectedBasicFields - The selected basic fields to set
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
   * @param {SelectedReferenceField[]} selectedReferenceFields - The selected reference fields to set
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
   * @param {string} label - The new label text
   * @returns
   */
  public updateLabel(label: string): void {
    this.subscription?.unsubscribe()
    const profile = this.stagedProfile

    if (profile) {
      let profiles: DataSelectionProfile[] = []
      this.profileProviderService
        .getAll()
        .subscribe((profiles_: DataSelectionProfile[]) => {
          profiles = profiles_
        })
        .unsubscribe()

      const newLabel = this.parseTrailingNumber(label)

      const sameProfiles = profiles.filter(
        (existingProfile: DataSelectionProfile) =>
          existingProfile.getId() !== profile.getId() && existingProfile.getLabel().getTexts().includes(newLabel.text.replace(/\s+$/, ''))
      )

      const wanted = newLabel.number ?? 0
      const taken = sameProfiles.some((existing: DataSelectionProfile) => existing.getLabelNumber() === wanted)
      // first profile is 0 (no suffix), first duplicate is (1)
      profile.setLabelNumber(taken ? Math.max(...sameProfiles.map((p: DataSelectionProfile) => p.getLabelNumber())) + 1 : wanted)
      profile.setLabel(newLabel.text)
      this.buildProfile()
    }
  }

  /**
   * Extracts the trailing number of the given text.
   * @todo lib needs to bee updated to newer version (es2019)
   * @param {string} text
   * @returns {{ text: string; number: number; }}
   */
  public parseTrailingNumber(text: string) {
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
   * @returns {Observable<void[]>} Observable of void array for completion tracking
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
   * @param {string[]} linkedProfileIds - Array of profile IDs to retrieve
   * @returns {Observable<void[]>} Observable of void array for completion tracking
   * @private
   */
  private getProfilesFromProviderAndSetInDataSelection(linkedProfileIds: string[]): Observable<void[]> {
    return this.profileProviderService.getAll().pipe(
      map((profileArray: Array<DataSelectionProfile>) =>
        linkedProfileIds.map((id: string) => {
          const profile = profileArray.find((p: DataSelectionProfile) => p.getId() === id)
          if (profile) {
            return this.setProfileInDataSelectionProvider(profile)
          }
        })
      )
    )
  }

  /**
   * Extracts referenced profile IDs from selected reference fields.
   * @param {SelectedReferenceField[]} selectedReferenceFields - Selected reference fields
   * @returns {string[]} Array of referenced profile IDs
   * @private
   */
  private getReferencedProfileIds(selectedReferenceFields: SelectedReferenceField[]): string[] {
    const linkedProfileIds = selectedReferenceFields
      .map((selectedReferenceField: SelectedReferenceField) => selectedReferenceField.getLinkedProfileIds())
      .reduce((acc: string[], ids: string[]) => acc.concat(ids), [])
    return linkedProfileIds
  }

  /**
   * Builds and saves the staged profile to providers and data selection.
   * @returns {Observable<void[]>} Observable of void array for completion tracking
   */
  public buildProfile(): Observable<void[]> {
    const profile = this.stagedProfile
    this.stagedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.setProfileInDataSelectionProvider(profile)
    return this.setLinkedProfillesInDataSelectionProvdier()
  }

  /**
   * Sets a profile in the active data selection.
   * @param {DataSelectionProfile} profile - The profile to set
   * @returns
   * @private
   */
  private setProfileInDataSelectionProvider(profile: DataSelectionProfile): void {
    this.dataSelectionProviderService.setActiveProfile(profile, 'SET')
  }
}
