import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractSearchResultProviderService } from './AbstractSearchResultProvider.servcie'

/**
 * Simple search result provider that manages a single result set.
 * Perfect for traditional search scenarios where you only need one result at a time.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class AbstractSimpleSearchResultProvider<
  C extends AbstractListEntry,
  T extends AbstractResultList<C>
> extends AbstractSearchResultProviderService<C, T> {
  private readonly searchResultSubject = new BehaviorSubject<T | null>(null)

  constructor() {
    super()
  }

  /**
   * Sets the current search result.
   *
   * @param {T} result The search result to be set.
   */
  public setSearchResults(result: T): void {
    this.searchResultSubject.next(result)
  }

  /**
   * Updates the current search results by appending new results.
   *
   * @param {T} result The new search results to be appended.
   */
  public updateSearchResults(result: T): void {
    const current = this.searchResultSubject.value
    const currentResults = current?.getResults() ?? []
    const updatedResults = [...currentResults, ...result.getResults()]
    result.setResults(updatedResults)
    this.searchResultSubject.next(result)
  }

  /**
   * Gets the current search result as an observable.
   *
   * @returns {Observable<T | null>} An Observable of the current search result.
   */
  public getSearchResults(): Observable<T | null> {
    return this.searchResultSubject.asObservable()
  }

  /**
   * Clears all search results (same as clearResults for simple provider).
   */
  public clearResults(): void {
    this.searchResultSubject.next(null)
  }
}
