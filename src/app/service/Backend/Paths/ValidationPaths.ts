export class ValidationPaths {
  public static readonly BASE_URL = 'validation';
  public static readonly VALIDATE_DATAQUERY = `${ValidationPaths.BASE_URL}/data`;
  public static readonly VALIDATE_CRTDL = `${ValidationPaths.BASE_URL}/crtdl`;
  public static readonly VALIDATE_CCDL = `${ValidationPaths.BASE_URL}/ccdl`;

  public static getBaseUrl(): string {
    return this.BASE_URL;
  }
}
