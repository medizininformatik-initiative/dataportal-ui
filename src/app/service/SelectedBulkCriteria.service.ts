import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { CriteriaBulkEntry } from '../model/Search/ListEntries/CriteriaBulkEntry'
import { AbstractArrayEntityProvider } from './Provider/Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class SelectedBulkCriteriaProvider extends AbstractArrayEntityProvider<CriteriaBulkEntry> {
  private uiProfileId: string | undefined
  private readonly searchResultsSubject = new Subject<CriteriaBulkEntry[]>()
  private readonly foundEntriesMap = new Map<string, CriteriaBulkEntry>()

  /**
   * Returns the id of the entry.
   * @param {CriteriaBulkEntry} entity
   * @returns {string}
   */
  protected selectId(entity: CriteriaBulkEntry): string {
    return entity.getId()
  }

  /**
   * Gets the currently selected criteria bulk entries as an observable.
   * @returns {Observable<CriteriaBulkEntry[]>} An observable containing the selected criteria bulk entries.
   */
  public getSelected(): Observable<CriteriaBulkEntry[]> {
    return this.getAll()
  }

  /**
   * Sets the search results for criteria bulk entries and updates the internal map of found entries.
   * @param {CriteriaBulkEntry[]} entries - The criteria bulk entries to set as search results.
   */
  public setSearchResults(entries: CriteriaBulkEntry[]): void {
    this.searchResultsSubject.next(entries)
    entries.forEach((entry: CriteriaBulkEntry) => this.foundEntriesMap.set(entry.getId(), entry))
  }

  /**
   * Gets the search results for criteria bulk entries as an observable.
   * @returns {Observable<CriteriaBulkEntry[]>} An observable containing the search results for criteria bulk entries.
   */
  public getSearchResults(): Observable<CriteriaBulkEntry[]> {
    return this.searchResultsSubject.asObservable()
  }

  /**
   * Returns the map of found entries.
   * @returns {Map<string, CriteriaBulkEntry>}
   */
  public getFoundEntriesMap(): Map<string, CriteriaBulkEntry> {
    return this.foundEntriesMap
  }

  /**
   * Returns the found entry with the given id.
   * @param {string} id
   * @returns {CriteriaBulkEntry | undefined}
   */
  public getFoundById(id: string): CriteriaBulkEntry | undefined {
    return this.foundEntriesMap.get(id)
  }

  /**
   * Returns the id of the UI profile.
   * @returns {string | undefined}
   */
  public getUiProfileId(): string | undefined {
    return this.uiProfileId
  }

  /**
   * Sets the id of the UI profile.
   * @param {string} uiProfileId
   */
  public setUiProfileId(uiProfileId: string): void {
    this.uiProfileId = uiProfileId
  }

  /**
   * Adds the entries to the selection.
   * @param {CriteriaBulkEntry[]} entries
   */
  public addSelected(entries: CriteriaBulkEntry[]): void {
    this.addMany(entries)
  }

  /**
   * Removes the entry from the selection if selected, otherwise adds it.
   * @param {CriteriaBulkEntry} entry
   */
  public toggle(entry: CriteriaBulkEntry): void {
    if (this.items.some((e: CriteriaBulkEntry) => this.selectId(e) === entry.getId())) {
      this.removeOne(entry.getId())
    } else {
      this.addOne(entry)
    }
  }

  /**
   * Removes the entries from the selection.
   * @param {CriteriaBulkEntry[]} entries
   */
  public deselect(entries: CriteriaBulkEntry[]): void {
    this.removeMany(entries.map((e: CriteriaBulkEntry) => e.getId()))
  }

  /**
   * Clears the selection.
   */
  public clear(): void {
    this.removeAll()
  }
}
