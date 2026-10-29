export class ActuatorPaths {
  private static readonly BASE_URL = 'actuator'

  public static readonly HEALTH_ENDPOINT = `${ActuatorPaths.BASE_URL}/health`
  public static readonly INFO_ENDPOINT = `${ActuatorPaths.BASE_URL}/info`

  public static getBaseUrl() {
    return this.BASE_URL
  }
}
