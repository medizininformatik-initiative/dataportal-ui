import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { AbstractKeyedSearchMediator } from '../Mediator/AbstractKeyedSearchMediator'
import { AbstractSearchPagination } from './AbstractSearchPagination'

/**
 * @abstract
 * Abstract pagination implementation for keyed search operations with datasets.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
@Injectable({
  providedIn: 'root',
})
export abstract class KeyedSearchPagination<C extends AbstractListEntry, T extends AbstractResultList<C>> extends AbstractSearchPagination<
  C,
  T
> {
  /**
   * Map to track current page numbers for each dataset key.
   * @protected
   */
  protected keyedPages: Map<string, number> = new Map()

  /**
   * Map to track total result counts for each dataset key.
   * @protected
   */
  protected keyedTotalResults: Map<string, number> = new Map()

  /**
   * The number of results per page for pagination calculations.
   * @protected
   */
  protected pageSize = 20

  /**
   * Creates an instance of KeyedSearchPagination.
   *
   * @param {AbstractKeyedSearchMediator<C, T>} mediatorService - The keyed search mediator for coordinating search operations
   * @protected
   */
  constructor(protected mediatorService: AbstractKeyedSearchMediator<C, T>) {
    super(mediatorService)
  }

  /**
   * Searches the first page.
   * @protected
   * Performs the initial search for the first page of results for a specific dataset key.
   *
   * @param {string} searchTerm - The search term to query for
   * @param {string[]} dataSetUrl - Array of dataset URLs that serve as the pagination key
   * @returns {Observable<T>} An Observable that emits the first page of search results
   * @throws Error when dataSetUrl array is empty
   */
  protected searchFirstPage(searchTerm: string, dataSetUrl: string[]): Observable<T> {
    if (dataSetUrl.length === 0) {
      throw new Error('KeyedSearchPagination requires a key parameter')
    }
    this.resetPaginationForKey(dataSetUrl)
    return this.mediatorService.searchAndSetProvider(searchTerm, 0, dataSetUrl)
  }

  /**
   * Loads the next page.
   * @protected
   * Loads the next page of results for a specific dataset key.
   *
   * @param {string} searchTerm - The search term to query for
   * @param {string[]} dataSetUrl - Array of dataset URLs that serve as the pagination key
   * @returns {Observable<T>} An Observable that emits the next page of search results
   * @throws Error when dataSetUrl array is empty
   */
  protected loadNextPage(searchTerm: string, dataSetUrl: string[]): Observable<T> {
    if (dataSetUrl.length === 0) {
      throw new Error('KeyedSearchPagination requires a key parameter')
    }
    const key = this.generateKeyFromDataSetUrls(dataSetUrl)
    const currentPage = this.keyedPages.get(key) || 0
    const nextPage = currentPage + 1
    this.keyedPages.set(key, nextPage)
    return this.mediatorService.searchAndUpdateProvider(searchTerm, nextPage, dataSetUrl)
  }

  /**
   * Generates the key from data set urls.
   * @private
   * Uses JSON serialization to create consistent keys for pagination state tracking.
   *
   * @param {string[]} dataSetUrls - Array of dataset URLs to convert to a key
   * @returns {string} A unique string key representing the dataset URL array
   */
  private generateKeyFromDataSetUrls(dataSetUrls: string[]): string {
    return JSON.stringify(dataSetUrls)
  }

  /**
   * Resets the pagination.
   * @protected
   * Resets pagination state for all dataset keys.
   */
  protected resetPagination(): void {
    super.resetPagination()
    this.keyedPages.clear()
    this.keyedTotalResults.clear()
  }

  /**
   * Resets the pagination for key.
   * @protected
   * Resets pagination state for a specific dataset key.
   *
   * @param {string[]} dataSetUrls - Array of dataset URLs to identify the key to reset
   */
  protected resetPaginationForKey(dataSetUrls: string[]): void {
    const key = this.generateKeyFromDataSetUrls(dataSetUrls)
    this.keyedPages.set(key, 0)
    this.keyedTotalResults.delete(key)
  }
}
