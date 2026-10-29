import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { ListEntryData } from 'src/app/model/Interface/Search/ListEntryData'
import { ResultListData } from 'src/app/model/Interface/Search/ResultListData'
import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service'
import { AbstractResultMapper } from './Abstract/Mapping/AbstractResultMapper'
import { FilterProvider } from './Filter/SearchFilterProvider.service'

/**
 * Core search engine service for executing search operations and managing filters.
 * Provides the fundamental functionality for fetching search results from the API
 * and applying various filters to search operations.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
@Injectable({
  providedIn: 'root',
})
export class SearchEngine<C extends AbstractListEntry, T extends AbstractResultList<C>> {
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly filterProvider = inject(FilterProvider)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * Creates an instance of SearchEngine.
   *
   * @param terminologyApiService - Service for making API calls to the terminology service
   * @param filterProvider - Provider for managing search filters
   */
  constructor() {}

  /**
   * Fetches search results from the API and maps them using the provided mapper.
   *
   * @param {string} url - The search URL to fetch results from
   * @param {AbstractResultMapper<C, T>} mapper - The result mapper for transforming API response to typed objects
   * @returns {Observable<T>} An Observable that emits the mapped search results
   */
  public fetchAndMapSearchResults<L extends ListEntryData>(url: string, mapper: AbstractResultMapper<C, T>): Observable<T> {
    return this.terminologyApiService
      .getSearchResults<L>(url)
      .pipe(map((response: ResultListData<L>) => mapper.mapResponseToResultList(response)))
  }

  /**
   * Gets the current terminology filter values as a comma-separated string.
   *
   * @returns {string} Comma-separated string of selected terminology filter values
   */
  public getTerminologyFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.TERMINOLOGY).join(',')
  }

  /**
   * Gets the current context filter values as a comma-separated string.
   *
   * @returns {string} Comma-separated string of selected context filter values
   */
  public getContextFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.CONTEXT).join(',')
  }

  /**
   * Gets the current availability filter values as a comma-separated string.
   *
   * @returns {string} Comma-separated string of selected availability filter values
   */
  public getAvailabilityFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.AVAILABILITY).join(',')
  }

  /**
   * Gets the current KDS module filter values as a comma-separated string.
   *
   * @returns {string} Comma-separated string of selected KDS module filter values
   */
  public getKdsModuleFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.KDS_MODULE).join(',')
  }
}
