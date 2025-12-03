import { Injectable } from '@angular/core';
import { TerminologyCode } from '../model/Terminology/TerminologyCode';
import { CriteriaBulkEntry } from '../model/Search/ListEntries/CriteriaBulkEntry';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/**
 * Service for managing selected bulk criteria entries.
 * Maintains the state of selected criteria and provides observable streams for updates.
 */
@Injectable({
  providedIn: 'root',
})
export class SelectedBulkCriteriaService {
  private selectedBulkCriteriaTermCodes: BehaviorSubject<CriteriaBulkEntry[]> = new BehaviorSubject<
    CriteriaBulkEntry[]
  >([]);
  private uiProfileId: string;

  private foundEntries: Subject<CriteriaBulkEntry[]> = new Subject<CriteriaBulkEntry[]>();
  private allFoundEntries: Map<string, CriteriaBulkEntry> = new Map();
  constructor() {}

  /**
   * Gets the selected bulk criteria as an Observable.
   * @returns Observable that emits the current array of selected CriteriaBulkEntry objects
   */
  public getSelectedBulkCriteria(): Observable<CriteriaBulkEntry[]> {
    return this.selectedBulkCriteriaTermCodes.asObservable();
  }

  /**
   * Sets the found entries and notifies subscribers.
   * @param entries - Array of found CriteriaBulkEntry objects
   */
  public setFoundEntries(entries: CriteriaBulkEntry[]): void {
    this.foundEntries.next(entries);
    entries.forEach((entry) => {
      this.allFoundEntries.set(entry.getId(), entry);
    });
  }

  /**
   * Gets the found entries as an Observable.
   * @returns Observable that emits arrays of found CriteriaBulkEntry objects
   */
  public getSelectedFoundEntries(): Observable<CriteriaBulkEntry[]> {
    return this.foundEntries.asObservable();
  }

  public getAllFoundEntries(): Map<string, CriteriaBulkEntry> {
    return this.allFoundEntries;
  }
  public getFoundEntry(id: string): CriteriaBulkEntry {
    return this.allFoundEntries.get(id);
  }
  /**
   * Gets the current UI profile ID.
   * @returns The UI profile ID string
   */
  public getUiProfileId(): string {
    return this.uiProfileId;
  }

  /**
   * Sets the UI profile ID.
   * @param uiProfileId - The UI profile ID to set
   */
  public setUiProfileId(uiProfileId: string): void {
    this.uiProfileId = uiProfileId;
  }

  /**
   * Adds multiple selected bulk criteria entries.
   * @param entries - Array of CriteriaBulkEntry objects to add
   */
  public addSelectedBulkCriteriaIds(entries: CriteriaBulkEntry[]): void {
    const currentEntries = this.selectedBulkCriteriaTermCodes.value;
    this.selectedBulkCriteriaTermCodes.next([...currentEntries, ...entries]);
  }

  /**
   * Toggles a selected bulk criterion entry (adds if not present, removes if present).
   * @param entry - The CriteriaBulkEntry to toggle
   */
  public addSelectedBulkCriterion(entry: CriteriaBulkEntry): void {
    const currentEntries = this.selectedBulkCriteriaTermCodes.value;
    if (!currentEntries.find((selectedEntry) => selectedEntry.getId() === entry.getId())) {
      this.selectedBulkCriteriaTermCodes.next([...currentEntries, entry]);
    } else {
      this.selectedBulkCriteriaTermCodes.next(
        currentEntries.filter((selectedEntry) => selectedEntry.getId() !== entry.getId())
      );
    }
  }

  /**
   * Removes multiple selected bulk criteria entries.
   * @param entries - Array of CriteriaBulkEntry objects to remove
   */
  public removeSelectedBulkCriterion(entries: CriteriaBulkEntry[]): void {
    console.log('Removing entries:', entries);
    const currentEntries = this.selectedBulkCriteriaTermCodes.value;
    this.selectedBulkCriteriaTermCodes.next(
      currentEntries.filter((selectedEntry) => {
        console.log('Checking selected entry:', selectedEntry);
        return !entries.find((entry) => entry.getId() === selectedEntry.getId());
      })
    );
  }

  /**
   * Clears all selected bulk criteria entries.
   */
  public clearSelectedBulkCriteriaIds(): void {
    this.selectedBulkCriteriaTermCodes.next([]);
  }
}
