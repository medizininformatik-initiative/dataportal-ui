export class UpgradePaths {
  public static readonly BASE_URL = 'upgrade';
  public static readonly UPGRADE_CRTDL = `${UpgradePaths.BASE_URL}/crtdl`;

  public static getBaseUrl(): string {
    return this.BASE_URL;
  }
}
