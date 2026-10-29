import { ElasticSearchFilterPaths } from 'src/app/service/Backend/Paths/ElasticSearchFilterPaths'
import { TerminologyPaths } from 'src/app/service/Backend/Paths/TerminologyPaths'
import { SearchUrlStrategy } from '../../../Interface/InterfaceSearchUrlStrategy'
import { SearchUrlBuilder } from '../../../UrlBuilder/SearchUrlBuilder'

export class CriteriaSearchUrlStrategy implements SearchUrlStrategy {
  private readonly searchText: string
  private readonly availabilityFilter: string
  private readonly contextFilter: string
  private readonly kdsFilter: string
  private readonly terminologyFilter: string

  constructor(
    searchText: string,
    availabilityFilter: string = ElasticSearchFilterPaths.AVAILABILITY,
    contextFilter: string = ElasticSearchFilterPaths.CONTEXTS,
    kdsFilter: string = ElasticSearchFilterPaths.KDSMODULES,
    terminologyFilter: string = ElasticSearchFilterPaths.TERMINOLOGIES
  ) {
    this.searchText = searchText
    this.availabilityFilter = availabilityFilter
    this.contextFilter = contextFilter
    this.kdsFilter = kdsFilter
    this.terminologyFilter = terminologyFilter
  }

  public getSearchUrl(page: number, pageSize: number): string {
    const url = new SearchUrlBuilder(TerminologyPaths.SEARCH_ENTRY_ENDPOINT)
      .withSearchTerm(this.searchText)
      .withAvailability(this.availabilityFilter)
      .withContext(this.contextFilter)
      .withKds(this.kdsFilter)
      .withTerminology(this.terminologyFilter)
      .withPage(pageSize)
      .withPageSize(page)
      .buildUrl()
    return url
  }
}
