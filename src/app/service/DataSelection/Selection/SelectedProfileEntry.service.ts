import { Injectable, Signal, signal } from '@angular/core'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'

@Injectable({
  providedIn: 'root',
})
export class SelectedProfileService {
  private readonly _selectedProfiles = signal<ProfileListEntry[]>([])
  private readonly profileIds = new Set<string>()

  /**
   * Returns the selected profiles as a readonly signal.
   */
  public getSelectedProfiles(): Signal<ProfileListEntry[]> {
    return this._selectedProfiles.asReadonly()
  }

  /**
   * Sets the selected profiles and updates the internal ID set.
   */
  public setSelectedProfiles(profiles: ProfileListEntry[]): void {
    this._selectedProfiles.set(profiles)
    this.profileIds.clear()
    profiles.forEach((profile) => this.profileIds.add(profile.getId()))
  }

  /**
   * Adds a profile to the current selection if it is not already included.
   */
  public addToSelection(profile: ProfileListEntry): void {
    if (this.profileIds.has(profile.getId())) {
      return
    }
    this._selectedProfiles.update((current) => [...current, profile])
    this.profileIds.add(profile.getId())
  }

  /**
   * Gets the IDs of all selected profiles.
   */
  public getSelectedIds(): string[] {
    return Array.from(this.profileIds)
  }

  /**
   * Removes a profile from the current selection.
   */
  public removeFromSelection(profile: ProfileListEntry): void {
    this._selectedProfiles.update((current) => current.filter((p) => p.getId() !== profile.getId()))
    this.profileIds.delete(profile.getId())
  }

  /**
   * Clears the current selection of all profiles.
   */
  public clearSelection(): void {
    this._selectedProfiles.set([])
    this.profileIds.clear()
  }
}
