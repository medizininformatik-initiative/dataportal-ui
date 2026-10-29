import { CRTDLData } from 'src/app/model/Interface/CRTDLData'
import { AnnotationsData } from './AnnotationsData'

export interface UpgradeData {
  crtdl: CRTDLData
  annotations: AnnotationsData[]
}
