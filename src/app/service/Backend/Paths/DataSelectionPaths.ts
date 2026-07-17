export class DataSelectionPaths {
  private static readonly BASE_URL = 'dse'
  public static readonly PROFILE_DATA_ENDPOINT = `${DataSelectionPaths.BASE_URL}/profile-data?ids=`
  public static readonly PROFILE_TREE_ENDPOINT = `${DataSelectionPaths.BASE_URL}/profile-tree`
  public static readonly PROFILE_SEARCH_ENTRY_ENDPOINT = `${DataSelectionPaths.BASE_URL}/profile-tree-entry`
  public static readonly PROFILE_SEARCH_ENDPOINT = `feature/entry/search`
  public static readonly PROFILE_ENTRY_DETAILS_ENDPOINT = `feature/entry`
  public static readonly PROFILE_ENTRY_DETAILS_LIST_ENDPOINT = `list-details`

  /**
   * Returns the base url
   * @returns {string}
   */
  public static getBaseUrl(): string {
    return this.BASE_URL
  }
}
