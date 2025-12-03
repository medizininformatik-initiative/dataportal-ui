export class CodeableConceptPaths {
  private static readonly BASE_URL = 'codeable-concept';

  public static readonly SEARCH_CONCEPT_ENDPOINT = `${CodeableConceptPaths.BASE_URL}/entry/search`;
  public static readonly ENTRY_CONCEPT_ENDPOINT = `${CodeableConceptPaths.BASE_URL}/entry?ids=`;
  public static readonly BULK_CONCEPT_ENDPOINT = `${CodeableConceptPaths.BASE_URL}/entry/bulk-search`;

  public static getBaseUrl() {
    return this.BASE_URL;
  }
}
