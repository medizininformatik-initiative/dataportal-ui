import { CodeMessageData } from '../CodeMessageData';
import { UpgradeDetailsType } from './UpgradeDetailsType';

export interface AnnotationsData {
  details: UpgradeDetailsType
  path: string
  value: CodeMessageData
}
