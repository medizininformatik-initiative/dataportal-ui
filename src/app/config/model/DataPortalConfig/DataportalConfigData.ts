/**
 * Data portal specific settings interface that defines configuration values
 * for portal functionality, API endpoints, polling behavior, and result boundaries.
 */
export interface DataportalConfigData {
  /**
   * Version string of the CCDL (Common Clinical Data Language) specification.
   * Indicates which version of the data standard is being used.
   */
  readonly passthroughCcdlVersion: string

  /**
   * URL for the DSE (Data Sharing Engine) patient profile service.
   * Used to retrieve detailed patient profile information.
   */
  readonly passthroughDsePatientProfileUrl: string

  /**
   * Polling time configuration string.
   * Specifies the duration or timing for polling operations.
   */
  readonly passthroughPollingTimeUi: string

  /**
   * URL link to the external proposal portal.
   * Used for redirecting users to submit research proposals.
   */
  readonly passthroughPortalLink: string

  /**
   * Base URL for the UI backend API service.
   * Used for all backend communication from the user interface.
   */
  readonly uiBackendApiPath: string

  /**
   * Maximum number of results to return for feasibility queries.
   */
  readonly readResultDetailedObfuscatedAmount: string

  /**
   * Interval configuration for detailed obfuscated results.
   */
  readonly readResultDetailedObfuscatedInterval: string

  /**
   * Polling interval for summary results.
   */
  readonly readResultSummaryPollingInterval: string

  /**
   * Polling interval for detailed obfuscated results.
   */
  readonly readResultDetailedObfuscatedPollingInterval: string

  /**
   * Expiry time for query result
   */
  readonly queryResultExpiry: string

  /**
   * max allowed saved queries per user
   */
  readonly maxSavedQueriesPerUser: number
}
