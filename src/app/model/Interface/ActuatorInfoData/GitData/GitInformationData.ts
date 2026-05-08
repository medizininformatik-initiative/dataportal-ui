import { BuildDetailsData } from '../BuildData/BuildDetailsData';
import { GitCommitData } from './GitCommitData';

export interface GitInformationData {
  build: BuildDetailsData
  commit: GitCommitData
}
