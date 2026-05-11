import { AbstractArrayEntityProvider } from './Provider/Abstract/AbstractArrayEntityProvider';
import { CriteriaBulkEntry } from '../model/Search/ListEntries/CriteriaBulkEntry';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedBulkCriteriaProvider extends AbstractArrayEntityProvider<CriteriaBulkEntry> {
  private uiProfileId: string | undefined;
  private searchResultsSubject = new Subject<CriteriaBulkEntry[]>();
  private foundEntriesMap = new Map<string, CriteriaBulkEntry>();

  /**
   * @param entity
   * @returns
   */
  protected selectId(entity: CriteriaBulkEntry): string {
    return entity.getId();
  }

  /**
   * Gets the currently selected criteria bulk entries as an observable.
   * @returns An observable containing the selected criteria bulk entries.
   */
  public getSelected(): Observable<CriteriaBulkEntry[]> {
    return this.getAll();
  }

  /**
   * Sets the search results for criteria bulk entries and updates the internal map of found entries.
   * @param entries - The criteria bulk entries to set as search results.
   */
  public setSearchResults(entries: CriteriaBulkEntry[]): void {
    this.searchResultsSubject.next(entries);
    entries.forEach((entry) => this.foundEntriesMap.set(entry.getId(), entry));
  }

  /**
   * Gets the search results for criteria bulk entries as an observable.
   * @returns An observable containing the search results for criteria bulk entries.
   */
  public getSearchResults(): Observable<CriteriaBulkEntry[]> {
    return this.searchResultsSubject.asObservable();
  }

  public getFoundEntriesMap(): Map<string, CriteriaBulkEntry> {
    return this.foundEntriesMap;
  }

  public getFoundById(id: string): CriteriaBulkEntry | undefined {
    return this.foundEntriesMap.get(id);
  }

  public getUiProfileId(): string | undefined {
    return this.uiProfileId;
  }

  public setUiProfileId(uiProfileId: string): void {
    this.uiProfileId = uiProfileId;
  }

  public addSelected(entries: CriteriaBulkEntry[]): void {
    this.addMany(entries);
  }

  public toggle(entry: CriteriaBulkEntry): void {
    if (this.items.some((e) => this.selectId(e) === entry.getId())) {
      this.removeOne(entry.getId());
    } else {
      this.addOne(entry);
    }
  }

  public deselect(entries: CriteriaBulkEntry[]): void {
    this.removeMany(entries.map((e) => e.getId()));
  }

  public clear(): void {
    this.removeAll();
  }
}
