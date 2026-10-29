export class TemplatePaths {
  public static readonly BASE_URL = 'query/'

  public static readonly TEMPLATE_QUERY_ENDPOINT = `${TemplatePaths.BASE_URL}/template`

  public static getBaseUrl() {
    return this.BASE_URL
  }
}
