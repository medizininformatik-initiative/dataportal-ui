export abstract class SearchUrlStrategy {
  public abstract getSearchUrl(page: number, pageSize: number): string
}
