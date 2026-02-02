import { GitBuildInformation } from './GitBuildInformation';
import { GitCommitInformation } from './GitCommitInformation';
import { GitInformationData } from 'src/app/model/Interface/ActuatorInfoData/GitData/GitInformationData';

export class GitInformation {
  private buildInformation: GitBuildInformation;
  private branch: string;
  private commitInformation: GitCommitInformation;

  constructor(
    buildInformation: GitBuildInformation,
    branch: string,
    commitInformation: GitCommitInformation
  ) {
    this.buildInformation = buildInformation;
    this.branch = branch;
    this.commitInformation = commitInformation;
  }

  public getBuildInformation(): GitBuildInformation {
    return this.buildInformation;
  }

  public setBuildInformation(buildInformation: GitBuildInformation): void {
    this.buildInformation = buildInformation;
  }

  public getBranch(): string {
    return this.branch;
  }

  public setBranch(branch: string): void {
    this.branch = branch;
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
      json.branch,
      GitCommitInformation.fromJson(json.commit)
    );
  }
}
