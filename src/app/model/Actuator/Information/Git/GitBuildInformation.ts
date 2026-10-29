import { GitBuildData } from '../../../Interface/ActuatorInfoData/GitData/GitBuildData'

export class GitBuildInformation {
  private version: string
  private time: string

  /**
   * Creates a new GitBuildInformation.
   *
   * @param version
   * @param time
   */
  constructor(version: string, time: string) {
    this.version = version
    this.time = time
  }

  public getVersion(): string {
    return this.version
  }

  /**
   * Sets the version.
   *
   * @param version
   */
  public setVersion(version: string): void {
    this.version = version
  }

  public getTime(): string {
    return this.time
  }

  /**
   * Sets the time.
   *
   * @param time
   */
  public setTime(time: string): void {
    this.time = time
  }

  /**
   * Creates an instance from its JSON data.
   *
   * @param json
   */
  public static fromJson(json: GitBuildData): GitBuildInformation {
    return new GitBuildInformation(json.version, json.time)
  }
}
