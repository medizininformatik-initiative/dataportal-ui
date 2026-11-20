import { Subscription } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from './Provider/DataSelectionProvider.service'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { ProfileProviderService } from './Provider/ProfileProvider.service'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { SelectedReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ProfileTimeRestrictionFilter } from '../model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from '../model/DataSelection/Profile/Filter/ProfileTokenFilter'

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
      const previousLinkedIds = profile.getProfileFields().getLinkedProfileIds()
      profile.getProfileFields().setSelectedReferenceFields(selectedReferenceFields)
      this.buildProfile()
      this.dataSelectionProviderService.resetUnlinkedReferences(previousLinkedIds)
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
          existingProfile.getId() !== profile.getId() &&
          existingProfile.getLabel().getTexts().includes(newLabel.text.replace(/\s+$/, ''))
      )

      const wanted = newLabel.number ?? 0
      const taken = sameProfiles.some((existing) => existing.getLabelNumber() === wanted)
      // first profile is 0 (no suffix), first duplicate is (1)
      profile.setLabelNumber(
        taken ? Math.max(...sameProfiles.map((p) => p.getLabelNumber())) + 1 : wanted
      )
      profile.setLabel(newLabel.text)
      this.buildProfile()
    }
  }

  /**
   * @todo lib needs to bee updated to newer version (es2019)
   * @param text
   * @returns
   */
  parseTrailingNumber(text: string) {
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
   * Builds and saves the staged profile to providers and data selection.
   */
  public buildProfile(): void {
    const profile = this.stagedProfile
    this.stagedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.setProfileInDataSelectionProvider(profile)
  }

  /**
   * Sets a profile in the active data selection.
   * @param profile - The profile to set
   * @returns
   * @private
   */
  private setProfileInDataSelectionProvider(profile: DataSelectionProfile): void {
    this.dataSelectionProviderService.setActiveProfile(profile)
  }
}
