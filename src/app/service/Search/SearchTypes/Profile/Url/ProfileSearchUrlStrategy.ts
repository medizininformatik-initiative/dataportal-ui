import { DataSelectionPaths } from 'src/app/service/Backend/Paths/DataSelectionPaths'
import { SearchUrlBuilder } from '../../../UrlBuilder/SearchUrlBuilder'
import { SearchUrlStrategy } from '../../../Interface/InterfaceSearchUrlStrategy'

export class ProfileSearchUrlStrategy implements SearchUrlStrategy {
  private searchText: string
  private moduleFilter: string
  private categoryFilter: string
  private resourceTypeFilter: string

  constructor(
    searchText: string,
    moduleFilter: string = '',
    categoryFilter: string = '',
    resourceTypeFilter: string = ''
  ) {
    this.searchText = searchText
    this.moduleFilter = moduleFilter
    this.categoryFilter = categoryFilter
    this.resourceTypeFilter = resourceTypeFilter
  }

  public getSearchUrl(page: number, pageSize?: number): string {
    const builder = new SearchUrlBuilder(DataSelectionPaths.PROFILE_SEARCH_ENDPOINT)
      .withSearchTerm(this.searchText)
      .withPage(page)
      .withPageSize(pageSize)

    if (this.moduleFilter) {
      builder.withModule(this.moduleFilter)
    }

    if (this.categoryFilter) {
      builder.withCategory(this.categoryFilter)
    }

    if (this.resourceTypeFilter) {
      builder.withResourceType(this.resourceTypeFilter)
    }

    return builder.buildUrl()
  }
}
