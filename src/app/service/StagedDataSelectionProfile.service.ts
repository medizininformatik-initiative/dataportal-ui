import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProfileCloner } from '../model/Utilities/DataSelecionCloner/DataSelectionProfileCloner';
import { DataSelectionProviderService } from '../modules/data-selection/services/DataSelectionProvider.service';
import { Injectable } from '@angular/core';
import { ProfileProviderService } from '../modules/data-selection/services/ProfileProvider.service';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import { SnackbarService } from '../shared/service/Snackbar/Snackbar.service';
import { ProfileTimeRestrictionFilter } from '../model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from '../model/DataSelection/Profile/Filter/ProfileTokenFilter';

/**
 * Service for managing staged profile changes before committing to data selection.
 * Provides methods to update profile fields, filters, and references in a staged manner.
 */
@Injectable({
  providedIn: 'root',
})
export class StagedProfileService {
  /**
   * @type {BehaviorSubject<DataSelectionProfile | null>} Subject holding the staged profile
   */
  private stagedProfileSubject = new BehaviorSubject<DataSelectionProfile | null>(null);

  /**
   * @type {Observable<DataSelectionProfile | null>} Observable of the staged profile
   */
  public readonly profile$ = this.stagedProfileSubject.asObservable();

  constructor(
    private dataSelectionProviderService: DataSelectionProviderService,
    private profileProviderService: ProfileProviderService,
    private snackbarService: SnackbarService
  ) {}

  /**
   * Initializes the staged profile with a profile from the provider.
   * @param id - The profile ID to initialize
   * @returns
   */
  public initialize(id: string): void {
    const profile = this.profileProviderService.getProfileById(id);
    this.stagedProfileSubject.next(profile);
  }

  /**
   * Gets an observable of the staged profile.
   * @returns Observable of the staged profile
   */
  public getProfile(): DataSelectionProfile {
    return this.stagedProfileSubject.getValue();
  }

  /**
   * Gets an observable of the staged profile.
   * @returns Observable of the staged profile
   */
  public getProfileObservable(): Observable<DataSelectionProfile | null> {
    return this.stagedProfileSubject.asObservable();
  }

  /**
   * Gets the current staged profile value.
   * @returns The current staged profile or null
   */
  public getStagedProfile(): DataSelectionProfile | null {
    return this.stagedProfileSubject.value;
  }

  /**
   * Updates the selected basic fields in the staged profile.
   * @param selectedBasicFields - The selected basic fields to set
   * @returns
   */
  public updateSelectedBasicFields(selectedBasicFields: SelectedBasicField[]): void {
    const profile = this.stagedProfileSubject.value;
    if (profile) {
      profile.getProfileFields().setSelectedBasicFields(selectedBasicFields);
      this.buildProfile();
    }
  }

  /**
   * Updates the selected reference fields in the staged profile.
   * @param selectedReferenceFields - The selected reference fields to set
   * @returns
   */
  public updateSelectedReferenceFields(selectedReferenceFields: SelectedReferenceField[]): void {
    const profile = this.stagedProfileSubject.value;
    if (profile) {
      profile.getProfileFields().setSelectedReferenceFields(selectedReferenceFields);
      this.setLinkedProfillesInDataSelectionProvdier();
      this.buildProfile();
    }
  }

  public updateProfileFilter(filter: ProfileTokenFilter | ProfileTimeRestrictionFilter): void {
    const profile = this.stagedProfileSubject.value;
    if (profile) {
      profile.setFilter(filter);
      this.buildProfile();
    }
  }

  /**
   * Updates the label of the staged profile.
   * @param label - The new label text
   * @returns
   */
  public updateLabel(label: string): void {
    const profile = this.stagedProfileSubject.value;
    if (profile) {
      profile.setLabel(label);
      this.buildProfile();
    }
  }
  /**
   * Sets linked profiles in the data selection provider.
   * @returns Observable of void array for completion tracking
   * @private
   */
  private setLinkedProfillesInDataSelectionProvdier(): Observable<void[]> {
    const profile = this.stagedProfileSubject.value;

    if (profile) {
      const selectedReferenceFields = [...profile.getProfileFields().getSelectedReferenceFields()];
      const linkedProfileIds = this.getReferencedProfileIds(selectedReferenceFields);
      return this.getProfilesFromProviderAndSetInDataSelection(linkedProfileIds);
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
    return this.profileProviderService.getProfileIdMap().pipe(
      tap((profileMap) => console.log('Profile Map:', profileMap)),
      map((profileMap: Map<string, DataSelectionProfile>) =>
        linkedProfileIds.map((id) => {
          const profile = profileMap.get(id);
          if (profile) {
            return this.setProfileInDataSelectionProvider(profile);
          }
        })
      )
    );
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
      .reduce((acc, ids) => acc.concat(ids), []);
    return linkedProfileIds;
  }

  /**
   * Builds and saves the staged profile to providers and data selection.
   * @returns Observable of void array for completion tracking
   */
  public buildProfile(): Observable<void[]> {
    const profile = this.stagedProfileSubject.value;
    this.triggerUpdate(profile);
    this.profileProviderService.setProfileById(profile.getId(), profile);
    this.setProfileInDataSelectionProvider(profile);
    this.snackbarService.displayInfoMessage('EDITOR.CONTENT.PROFILE.SNACKBAR.SAVED');
    return this.setLinkedProfillesInDataSelectionProvdier();
  }

  /**
   * Triggers an update by deep copying the profile and emitting to subscribers.
   * @param profile - The profile to update
   * @returns
   * @private
   */
  private triggerUpdate(profile: DataSelectionProfile): void {
    this.stagedProfileSubject.next(DataSelectionProfileCloner.deepCopyProfile(profile));
  }

  /**
   * Sets a profile in the active data selection.
   * @param profile - The profile to set
   * @returns
   * @private
   */
  private setProfileInDataSelectionProvider(profile: DataSelectionProfile): void {
    this.dataSelectionProviderService.setProfileInActiveDataSelection(profile);
  }
}
