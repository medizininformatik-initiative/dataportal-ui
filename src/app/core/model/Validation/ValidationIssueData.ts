import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData';
export interface TimeRestrictionValidationIssueData {
  timeRestriction: {
    afterDate: string
    beforeDate: string
  }
}

export interface QuantityUnitValidationIssueData {
  selected: string
  allowed: string[]
}

export interface QuantityRangeValidationIssueData {
  valueFilter: {
    type: 'quantity-range'
    selectedConcepts: []
    unit: {
      code: string
      display: string
    }
    minValue: number
    maxValue: number
  }
}

export interface CriteriaSetValidationIssueData {
  criteriaSets: string[]
  termCode: TerminologyCodeData
}

export interface DataExtractionValidationIssueData {
  type: string
  name: string
  start: string
  end: string
}

export interface ValueSetValidationIssueData {
  selectedConcepts: TerminologyCodeData
  valueSets: string[]
}

export type ValidationIssueData =
  | TimeRestrictionValidationIssueData
  | QuantityUnitValidationIssueData
  | CriteriaSetValidationIssueData
  | ValueSetValidationIssueData
  | QuantityRangeValidationIssueData
  | DataExtractionValidationIssueData;
