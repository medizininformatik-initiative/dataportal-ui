import { GitInformationData } from './GitData/GitInformationData';
import { TerminologyInformationData } from './Terminology/TerminologyInformationData';

export interface ActuatorData {
  git: GitInformationData
  terminology: TerminologyInformationData
}
