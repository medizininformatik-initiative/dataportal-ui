import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'

@Injectable({
  providedIn: 'root',
})
export class SelectedProfileService {
  private readonly selectedProfiles = new BehaviorSubject<ProfileListEntry[]>([])

  private readonly profileIds = new Set<string>()

  /**
   * Gets the selected profiles as an observable.
   */
  public getSelectedProfiles(): Observable<ProfileListEntry[]> {
    return this.selectedProfiles.asObservable()
  }

  /**
   * Sets the selected profiles and updates the internal ID set.
   *
   * @param profiles The profiles to be set.
   */
  public setSelectedProfiles(profiles: ProfileListEntry[]): void {
    this.selectedProfiles.next(profiles)

    this.profileIds.clear()
    profiles.forEach((profile) => {
      this.profileIds.add(profile.getId())
    })
  }

  /**
   * Adds a profile to the current selection if it is not already included.
   *
   * @param profile The profile to be added to the selection.
   */
  public addToSelection(profile: ProfileListEntry): void {
    if (this.profileIds.has(profile.getId())) {
      return
    }

    const currentSelection = this.selectedProfiles.getValue()

    this.selectedProfiles.next([...currentSelection, profile])

    this.profileIds.add(profile.getId())
  }

  /**
   * Gets the IDs of all selected profiles.
   *
   * @returns An array of profile IDs.
   */
  public getSelectedIds(): string[] {
    return Array.from(this.profileIds)
  }

  /**
   * Removes a profile from the current selection.
   *
   * @param profile The profile to be removed from the selection.
   */
  public removeFromSelection(profile: ProfileListEntry): void {
    const updatedSelection = this.selectedProfiles
      .getValue()
      .filter((selectedProfile) => selectedProfile.getId() !== profile.getId())

    this.selectedProfiles.next(updatedSelection)
    this.profileIds.delete(profile.getId())
  }

  /**
   * Clears the current selection of all profiles.
   */
  public clearSelection(): void {
    this.selectedProfiles.next([])
    this.profileIds.clear()
  }
}
