import { BuildDetailsData } from '../BuildData/BuildDetailsData';
import { GitBranchData } from './GitBranchData';
import { GitCommitData } from './GitCommitData';

export interface GitInformationData {
  build: BuildDetailsData
  commit: GitCommitData
  branch: string
}
