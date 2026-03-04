import { DisplayData } from './DisplayData';

export interface CriteriaRelativeData {
  display: DisplayData
  selectable: boolean
  termcode: string
  terminology: string
  contextualizedTermcodeHash: string
}
