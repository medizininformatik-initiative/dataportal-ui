import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataSelectionProfileTreeNode } from 'src/app/model/DataSelection/ProfileTree/DataSelectionProfileTreeNode';

@Injectable({
  providedIn: 'root',
})
export class SelectedDataSelectionProfileService {
  private selectedProfiles = new BehaviorSubject<DataSelectionProfileTreeNode[]>([]);

  private profileUrls = new Set<string>();

  /**
   * Gets the selected profiles as an observable.
   */
  public getSelectedProfiles(): Observable<DataSelectionProfileTreeNode[]> {
    return this.selectedProfiles.asObservable();
  }

  /**
   * Sets the selected profiles and updates the internal ID set.
   *
   * @param profiles The profiles to be set.
   */
  public setSelectedProfiles(profiles: DataSelectionProfileTreeNode[]): void {
    this.selectedProfiles.next(profiles);
    this.profileUrls.clear();
    profiles.forEach((profile) => this.profileUrls.add(profile.getUrl()));
  }

  /**
   * Adds a profile to the current selection if it is not already included.
   *
   * @param profile The profile to be added to the selection.
   */
  public addToSelection(profile: DataSelectionProfileTreeNode): void {
    const currentSelection = this.selectedProfiles.getValue();
    if (!this.profileUrls.has(profile.getUrl())) {
      this.selectedProfiles.next([...currentSelection, profile]);
      this.profileUrls.add(profile.getUrl());
    }
  }

  /**
   * Gets the IDs of all selected items.
   *
   * @returns An array of IDs.
   */
  public getSelectedUrls(): string[] {
    return Array.from(this.profileUrls);
  }

  /**
   * Removes a profile from the current selection.
   *
   * @param profile The profile to be removed from the selection.
   */
  public removeFromSelection(profile: DataSelectionProfileTreeNode): void {
    const currentSelection = this.selectedProfiles.getValue();
    const updatedSelection = currentSelection.filter((p) => p.getUrl() !== profile.getUrl());
    this.selectedProfiles.next(updatedSelection);
    this.profileUrls.delete(profile.getUrl());
  }

  /**
   * Clears the current selection of all profiles.
   */
  public clearSelection(): void {
    this.selectedProfiles.next([]);
    this.profileUrls.clear();
  }
}
