import { GitBuildInformation } from './GitBuildInformation';
import { GitCommitInformation } from './GitCommitInformation';
import { GitInformationData } from 'src/app/model/Interface/ActuatorInfoData/GitData/GitInformationData';

export class GitInformation {
  private buildInformation: GitBuildInformation;
  private commitInformation: GitCommitInformation;

  constructor(buildInformation: GitBuildInformation, commitInformation: GitCommitInformation) {
    this.buildInformation = buildInformation;
    this.commitInformation = commitInformation;
  }

  public getBuildInformation(): GitBuildInformation {
    return this.buildInformation;
  }

  public setBuildInformation(buildInformation: GitBuildInformation): void {
    this.buildInformation = buildInformation;
  }

  public getCommitInformation(): GitCommitInformation {
    return this.commitInformation;
  }

  public setCommitInformation(commitInformation: GitCommitInformation): void {
    this.commitInformation = commitInformation;
  }

  public static fromJson(json: GitInformationData): GitInformation {
    return new GitInformation(
      GitBuildInformation.fromJson(json.build),
      GitCommitInformation.fromJson(json.commit)
    );
  }
}
