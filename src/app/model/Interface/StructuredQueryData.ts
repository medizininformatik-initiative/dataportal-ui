import { StructuredQueryCriterionData } from './StructuredQueryCriterionData';

export interface StructuredQueryData {
  readonly version: string
  display: string
  inclusionCriteria: StructuredQueryCriterionData[][]
  exclusionCriteria?: StructuredQueryCriterionData[][]
}
