import { ElasticSearchFilterPaths } from '../../Backend/Paths/ElasticSearchFilterPaths';
import { InterfaceUrlBuilder } from '../../Backend/UrlBuilder/InterfaceUrlBuilder';

export class SearchUrlBuilder implements InterfaceUrlBuilder {
  private baseUrl: string;
  private queryParams: Map<string, string> = new Map();

  /**
   * The maximum number of pages shown each page contains {$MAX_ENTRIES_PER_PAGE}
   */
  public static readonly MAX_PAGES = 20;
  /**
   * The default number of pages shown
   */
  public static readonly DEFAULT_PAGES = 20;

  /**
   * The maximum number of entries per page is set to 20 to prevent performance issues with large datasets.
   */
  public static readonly MAX_ENTRIES_PER_PAGE = 20;

  constructor(path: string) {
    this.baseUrl = path;
  }

  public setBasePath(path: string): this {
    this.baseUrl = path;
    return this;
  }

  public withSearchTerm(searchTerm: string): this {
    this.queryParams.set('searchterm', searchTerm);
    return this;
  }

  public withContext(context: string): this {
    this.queryParams.set(ElasticSearchFilterPaths.CONTEXTS, context);
    return this;
  }

  public withTerminology(terminology: string): this {
    this.queryParams.set(ElasticSearchFilterPaths.TERMINOLOGIES, terminology);
    return this;
  }

  public withKds(kds: string): this {
    this.queryParams.set(ElasticSearchFilterPaths.KDSMODULES, kds);
    return this;
  }

  public withAvailability(availability: string): this {
    this.queryParams.set(ElasticSearchFilterPaths.AVAILABILITY, availability);
    return this;
  }

  public withFiltertUrl(path: string, criteriaSetUrl: string): this {
    this.queryParams.set(path, encodeURI(criteriaSetUrl));
    return this;
  }

  public withPageSize(limit: number = SearchUrlBuilder.MAX_ENTRIES_PER_PAGE): this {
    if (limit > SearchUrlBuilder.MAX_ENTRIES_PER_PAGE) {
      limit = SearchUrlBuilder.MAX_ENTRIES_PER_PAGE;
    }
    this.queryParams.set('page-size', limit.toString());
    return this;
  }

  public withTargetFilter(targetFilter: string): this {
    this.queryParams.set('targetFilter', targetFilter);
    return this;
  }

  /**
   * The page size is limited to 20 to prevent performance issues with large datasets.
   * @param offset
   * @returns
   */
  public withPage(offset: number): this {
    if (offset > SearchUrlBuilder.MAX_PAGES) {
      offset = SearchUrlBuilder.MAX_PAGES;
    }
    this.queryParams.set('page', offset.toString());
    return this;
  }

  public withId(id: string) {
    this.queryParams.set('id', id);
    return this;
  }

  public buildUrl(): string {
    const queryParamsArray: string[] = [];
    this.queryParams.forEach((value, key) => {
      queryParamsArray.push(`${key}=${value}`);
    });
    const queryParamsString = queryParamsArray.join('&');
    return `${this.baseUrl}?${queryParamsString}`;
  }
}
