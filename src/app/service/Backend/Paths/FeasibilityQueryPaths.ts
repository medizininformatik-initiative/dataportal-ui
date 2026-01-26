export class FeasibilityQueryPaths {
  private static readonly BASE_URL = 'query/feasibility';

  public static readonly EXECUTE_QUERY = this.BASE_URL;
  public static readonly DETAILED_RESULT_RATE_LIMIT = `${FeasibilityQueryPaths.BASE_URL}/detailed-obfuscated-result-rate-limit`;
  public static readonly SAVED_QUERY_SLOTS = `${FeasibilityQueryPaths.BASE_URL}/saved-query-slots`;
  public static readonly SAVE_QUERY = '/saved';

  public static getBaseUrl() {
    return this.BASE_URL;
  }
}
