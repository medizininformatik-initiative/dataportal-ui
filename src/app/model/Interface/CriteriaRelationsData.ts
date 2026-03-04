import { CriteriaRelativeData } from './CriteriaRelativesData';
import { DisplayData } from './DisplayData';

export interface CriteriaRelationsData {
  display: DisplayData
  selectable: boolean
  termcode: string
  terminology: string
  parents?: CriteriaRelativeData[]
  children?: CriteriaRelativeData[]
  relatedTerms?: CriteriaRelativeData[]
}
