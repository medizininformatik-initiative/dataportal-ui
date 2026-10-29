import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { AbstractResultList } from 'src/app/model/Search/ResultList/AbstractResultList'

/**
 * @abstract
 * Abstract base class for mapping raw search responses to typed result objects.
 * Defines the contract for transforming API responses into structured search results
 * that can be consumed by the application.
 *
 * @template C - Type extending AbstractListEntry representing individual search result entries
 * @template T - Type extending AbstractResultList representing the complete search result list
 */
export abstract class AbstractResultMapper<C extends AbstractListEntry, T extends AbstractResultList<C>> {
  /**
   * @abstract
   * Maps a raw API response to a structured result list.
   *
   * @param {any} response - The raw response from the search API
   * @returns {T} A typed result list containing the mapped search results
   */
  public abstract mapResponseToResultList(response: any): T

  /**
   * @abstract
   * Maps an array of raw result objects to typed list entries.
   *
   * @param {any[]} results - Array of raw result objects from the API response
   * @returns {C[]} Array of typed list entries
   */
  public abstract mapResponseToEntries(results: any[]): C[]
}
