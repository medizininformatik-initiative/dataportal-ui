import { AbstractKeyedSearchEngineService } from '../../../Abstract/Engine/AbstractKeyedSearchEngine.service'
import { CriteriaSetResultMapperStrategy } from '../Mapper/CriteriaSetResultMapperStrategy'
import { CriteriaSetSearchUrlStrategy } from '../Url/CriteriaSetSearchUrlStrategy'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry'
import { ReferenceCriteriaResultList } from 'src/app/model/Search/ResultList/ReferenceCriteriaResultList'
import { SearchEngine } from '../../../SearchEngine'

/**
 * Search engine service for criteria set searches with dataset filtering.
 * Extends AbstractKeyedSearchEngineService to provide concrete functionality for searching
 * reference criteria within specified criteria sets with pagination support.
 */
@Injectable({
  providedIn: 'root',
})
export class CriteriaSetSearchEngineService extends AbstractKeyedSearchEngineService<
  ReferenceCriteriaListEntry,
  ReferenceCriteriaResultList
> {
  protected searchEngine: SearchEngine<ReferenceCriteriaListEntry, ReferenceCriteriaResultList>
  private searchResultProcessorService =
    inject<SearchEngine<ReferenceCriteriaListEntry, ReferenceCriteriaResultList>>(SearchEngine)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * Creates an instance of CriteriaSetSearchEngineService.
   *
   * @param searchEngine - The underlying search engine service for processing search requests
   * @param searchResultProcessorService - Additional search engine for result processing
   * @protected
   */
  constructor() {
    const searchEngine =
      inject<SearchEngine<ReferenceCriteriaListEntry, ReferenceCriteriaResultList>>(SearchEngine)

    super(searchEngine)
    this.searchEngine = searchEngine
  }

  /**
   * Performs a criteria set search operation with pagination support.
   *
   * @param searchText - The text to search for within criteria sets
   * @param page - The page number for pagination (defaults to 0)
   * @param criteriaSetUrls - Array of criteria set URLs to search within
   * @returns An Observable that emits the search results
   */
  public search(
    searchText: string,
    page: number = 0,
    criteriaSetUrls: string[]
  ): Observable<ReferenceCriteriaResultList> {
    const resultMapper = this.getMapping()
    const url = this.createUrl(searchText, page, criteriaSetUrls)
    return this.searchResultProcessorService.fetchAndMapSearchResults(url, resultMapper)
  }

  /**
   * @protected
   * Creates a search URL for criteria set operations with dataset filtering.
   *
   * @param searchText - The text to search for
   * @param page - The page number for pagination (defaults to 0)
   * @param criteriaSetUrls - Array of criteria set URLs to filter the search
   * @returns The constructed search URL as a string
   */
  protected createUrl(searchText: string, page: number = 0, criteriaSetUrls: string[]): string {
    return new CriteriaSetSearchUrlStrategy(searchText, criteriaSetUrls).getSearchUrl(page)
  }

  /**
   * @protected
   * Provides the mapping strategy for transforming criteria set search results.
   *
   * @returns An instance of CriteriaSetResultMapperStrategy for result mapping
   */
  protected getMapping(): CriteriaSetResultMapperStrategy {
    return new CriteriaSetResultMapperStrategy()
  }
}
