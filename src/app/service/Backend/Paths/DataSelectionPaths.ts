export class DataSelectionPaths {
  private static readonly BASE_URL = 'dse'
  public static readonly PROFILE_DATA_ENDPOINT = `${DataSelectionPaths.BASE_URL}/profile-data?ids=`
  public static readonly PROFILE_SEARCH_ENDPOINT = `profile/entry/search`
  public static readonly PROFILE_ENTRY_DETAILS_ENDPOINT = `profile/entry`
  public static readonly PROFILE_ENTRY_DETAILS_LIST_ENDPOINT = `list-details`
  public static readonly PROFILE_SEARCH_FILTER = `profile/search/filter`
  /**
   * Returns the base url
   * @returns {string}
   */
  public static getBaseUrl(): string {
    return this.BASE_URL
  }
}
