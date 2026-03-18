import { AnnotationsData } from './AnnotationsData';
import { CRTDLData } from 'src/app/model/Interface/CRTDLData';

export interface UpgradeData {
  crtdl: CRTDLData
  annotations: AnnotationsData[]
}
