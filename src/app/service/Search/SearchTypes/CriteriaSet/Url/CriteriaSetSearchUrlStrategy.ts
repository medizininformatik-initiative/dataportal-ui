import { ElasticSearchFilterPaths } from '../../../../Backend/Paths/ElasticSearchFilterPaths'
import { TerminologyPaths } from '../../../../Backend/Paths/TerminologyPaths'
import { SearchUrlStrategy } from '../../../Interface/InterfaceSearchUrlStrategy'
import { SearchUrlBuilder } from '../../../UrlBuilder/SearchUrlBuilder'

export class CriteriaSetSearchUrlStrategy implements SearchUrlStrategy {
  /**
   * The path to the search endpoint for criteria sets.
   * This is used to construct the full URL for searching criteria sets.
   */
  private readonly path: string = TerminologyPaths.SEARCH_ENTRY_ENDPOINT

  /**
   * Array of criteria set URLs to filter the search results.
   * This allows the search to be scoped to specific criteria sets.
   */
  private readonly criteriaSetUrls: string[] = []
  private readonly searchText: string
  /**
   * Constructor to initialize search text and criteria set URLs.
   * @param {string} searchText The text to search for.
   * @param {string[]} criteriaSetUrls The URLs of the criteria sets to filter by.
   */
  constructor(searchText: string, criteriaSetUrls: string[]) {
    this.criteriaSetUrls = criteriaSetUrls
    this.searchText = searchText
  }

  public getSearchUrl(page: number, pageSize: number = SearchUrlBuilder.MAX_ENTRIES_PER_PAGE): string {
    const criteriaSetUrl = this.criteriaSetUrls.length > 0 ? this.criteriaSetUrls.join(',') : this.criteriaSetUrls[0]

    return new SearchUrlBuilder(this.path)
      .withSearchTerm(this.searchText)
      .withPageSize(pageSize)
      .withPage(page)
      .withFiltertUrl(ElasticSearchFilterPaths.CRITERIASETS, criteriaSetUrl)
      .buildUrl()
  }
}
