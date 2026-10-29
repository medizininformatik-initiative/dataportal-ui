import { GitCommitIdData } from 'src/app/model/Interface/ActuatorInfoData/GitData/GitCommitIdData'

export class GitCommitIdInformation {
  private full: string
  private abbrev: string
  /**
   * Creates a new GitCommitIdInformation.
   *
   * @param full
   * @param abbrev
   */
  constructor(full: string, abbrev: string) {
    this.full = full
    this.abbrev = abbrev
  }

  public getFull(): string {
    return this.full
  }

  /**
   * Sets the full.
   *
   * @param full
   */
  public setFull(full: string): void {
    this.full = full
  }

  public getAbbrev(): string {
    return this.abbrev
  }

  /**
   * Sets the abbrev.
   *
   * @param abbrev
   */
  public setAbbrev(abbrev: string): void {
    this.abbrev = abbrev
  }

  /**
   * Creates an instance from its JSON data.
   *
   * @param json
   */
  public static fromJson(json: GitCommitIdData): GitCommitIdInformation {
    return new GitCommitIdInformation(json.full, json.abbrev)
  }
}
