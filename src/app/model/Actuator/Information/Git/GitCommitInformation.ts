import { GitCommitData } from 'src/app/model/Interface/ActuatorInfoData/GitData/GitCommitData'
import { GitCommitIdInformation } from './GitCommitIdInformation'

export class GitCommitInformation {
  private id: GitCommitIdInformation

  /**
   * Creates a new GitCommitInformation.
   *
   * @param id
   */
  constructor(id: GitCommitIdInformation) {
    this.id = id
  }

  public getCommitId(): GitCommitIdInformation {
    return this.id
  }

  /**
   * Sets the commit id.
   *
   * @param id
   */
  public setCommitId(id: GitCommitIdInformation): void {
    this.id = id
  }

  /**
   * Creates an instance from its JSON data.
   *
   * @param json
   */
  public static fromJson(json: GitCommitData): GitCommitInformation {
    return new GitCommitInformation(GitCommitIdInformation.fromJson(json.id))
  }
}
