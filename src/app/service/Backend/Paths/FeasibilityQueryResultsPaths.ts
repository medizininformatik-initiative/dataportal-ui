export class FeasibilityQueryResultPaths {
  private static readonly BASE_URL = 'query/feasibility'
  public static readonly DETAILED_RESULT = '/detailed-result'
  public static readonly DETAILED_OBFUSCATED_RESULT = '/detailed-obfuscated-result'
  public static readonly DETAILED_OBFUSCATED_RESULT_RATE_LIMIT = '/detailed-obfuscated-result-rate-limit'
  public static readonly SUMMARY_RESULT = '/summary-result'

  public static getBaseUrl() {
    return this.BASE_URL
  }
}
