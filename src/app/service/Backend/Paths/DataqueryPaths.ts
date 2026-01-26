export class DataqueryPaths {
  private static readonly BASE_URL = 'query';
  public static readonly DATA = `${DataqueryPaths.BASE_URL}/data`;
  public static readonly CRTDL = `crtdl`;
  public static readonly SAVED_QUERY_SLOTS = `${DataqueryPaths.BASE_URL}/data/saved-query-slots`;
  public static readonly SKIP_VALIDATION = `?skip-validation=`;

  public getBaseUrl(): string {
    return DataqueryPaths.BASE_URL;
  }
}
