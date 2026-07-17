import { DataSelectionPaths } from 'src/app/service/Backend/Paths/DataSelectionPaths'
import { SearchUrlBuilder } from '../../../UrlBuilder/SearchUrlBuilder'
import { SearchUrlStrategy } from '../../../Interface/InterfaceSearchUrlStrategy'

export class ProfileSearchUrlStrategy implements SearchUrlStrategy {
  private readonly path: string = DataSelectionPaths.PROFILE_SEARCH_ENDPOINT
  constructor(private searchText: string) {}

  /**
   * Get the search URL for the profile search.
   * @param {number} page
   * @param {number} pageSize
   * @returns {string}
   */
  public getSearchUrl(page: number, pageSize?: number): string {
    return new SearchUrlBuilder(this.path)
      .withSearchTerm(this.searchText)
      .withPage(page)
      .withPageSize(pageSize)
      .buildUrl()
  }
}
