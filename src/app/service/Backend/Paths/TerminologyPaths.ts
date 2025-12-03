/**
 * Central registry of terminology-related API endpoint paths.
 * Provides static URL constants for terminology service operations.
 */
export class TerminologyPaths {
  /**
   * Base URL path for all terminology-related endpoints
   */
  public static readonly BASE_URL = 'terminology';

  /**
   * Endpoint for retrieving criteria profile data by IDs
   * Append query parameter with comma-separated profile IDs
   */
  public static readonly CRITERIA_PROFILE_ENDPOINT = `${TerminologyPaths.BASE_URL}/criteria-profile-data?ids=`;

  /**
   * Endpoint for accessing terminology entries
   */
  public static readonly ENTRY_ENDPOINT = `${TerminologyPaths.BASE_URL}/entry`;

  /**
   * Endpoint for searching terminology entries
   */
  public static readonly SEARCH_ENTRY_ENDPOINT = `${TerminologyPaths.BASE_URL}/entry/search`;

  /**
   * Endpoint for filtering search results
   */
  public static readonly SEARCH_FILTER_ENDPOINT = `${TerminologyPaths.BASE_URL}/search/filter`;

  /**
   * Endpoint for retrieving available terminology systems
   */
  public static readonly SYSTEMS_ENDPOINT = `${TerminologyPaths.BASE_URL}/systems`;

  /**
   * Endpoint path segment for accessing entity relations
   */
  public static readonly RELATIONS_ENDPOINT = '/relations';

  /**
   * Endpoint for retrieving UI profile configurations
   */
  public static readonly UIPROFILE_ENDPOINT = `${TerminologyPaths.BASE_URL}/ui-profile`;

  /**
   * Endpoint for performing bulk search operations
   */
  public static readonly BULK_SEARCH_ENDPOINT = `${TerminologyPaths.ENTRY_ENDPOINT}/bulk-search`;

  /**
   * Retrieves the base URL for terminology endpoints
   * @returns The base URL string for terminology service
   */
  public static getBaseUrl(): string {
    return this.BASE_URL;
  }
}
