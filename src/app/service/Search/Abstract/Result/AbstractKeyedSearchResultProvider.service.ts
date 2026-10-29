import { Injectable } from '@angular/core'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearchResultProviderService } from './AbstractSearchResultProvider.servcie'

/**
 * Keyed search result provider that manages multiple result sets identified by keys.
 * Perfect for scenarios like CodeableConcept searches where you need separate results
 * for different concept filters or value sets.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class AbstractKeyedSearchResultProvider<
  C extends AbstractListEntry,
  T extends AbstractResultList<C>
> extends AbstractSearchResultProviderService<C, T> {
  private readonly searchResultSubject = new BehaviorSubject<Map<string, T | null>>(new Map())

  constructor() {
    super()
  }

  /**
   * Sets the search result for a specific key.
   *
   * @param {string[]} dataSetUrls These are the keys to identify the result set.
   * @param {T} result The search result to be set.
   */
  public setSearchResults(dataSetUrls: string[], result: T): void {
    const key = this.generateKey(dataSetUrls)
    const currentResults = new Map(this.searchResultSubject.value)
    currentResults.set(key, result)
    this.searchResultSubject.next(currentResults)
  }

  /**
   * Updates the search results for a specific key by appending new results.
   *
   * @param {string[]} dataSetUrls These are the keys to identify the result set.
   * @param {T} result The new search results to be appended.
   */
  public updateSearchResults(dataSetUrls: string[], result: T): void {
    const currentResults = new Map(this.searchResultSubject.value)
    const key = this.generateKey(dataSetUrls)
    const existingResult = currentResults.get(key)

    if (existingResult) {
      const currentEntries = existingResult.getResults() ?? []
      const updatedEntries = [...currentEntries, ...result.getResults()]
      result.setResults(updatedEntries)
    }

    currentResults.set(key, result)
    this.searchResultSubject.next(currentResults)
  }

  /**
   * Gets the search results for a specific key as an observable.
   *
   * @param key The key to identify the result set.
   * @returns {Observable<T | null>} An Observable of the search result for the given key.
   * @param {string[]} dataSetUrls
   */
  public getSearchResults(dataSetUrls: string[]): Observable<T | null> {
    const key = this.generateKey(dataSetUrls)
    return this.searchResultSubject.asObservable().pipe(map((resultsMap) => resultsMap.get(key) ?? null))
  }

  /**
   * Clears the search result for a specific key.
   *
   * @param {string[]} dataSetUrls The dataSetUrls to identify the result set to clear.
   */
  public clearResults(dataSetUrls: string[]): void {
    const key = this.generateKey(dataSetUrls)
    const currentResults = new Map(this.searchResultSubject.value)
    if (currentResults.has(key)) {
      currentResults.set(key, null)
      this.searchResultSubject.next(currentResults)
    }
  }

  /**
   * Clears all stored search results in the map.
   */
  public clearAllResults(): void {
    this.searchResultSubject.next(new Map())
  }

  /**
   * Generates a unique key for the result set based on the provided dataset URLs.
   * @param {string[]} dataSetUrls These are the keys to identify the result set.
   * @returns {string}
   */
  private generateKey(dataSetUrls: string[]): string {
    return JSON.stringify(dataSetUrls)
  }
}
