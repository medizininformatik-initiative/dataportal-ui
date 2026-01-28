import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData';
export interface TimeRestrictionValidationIssueData {
  afterdate: string
  beforedate: string
}

export interface QuantityValidationIssueData {
  selected: string
  allowed: string[]
}

export interface CriteriaSetValidationIssueData {
  criteriaSets: string[]
  termCode: TerminologyCodeData
}

export interface ValueSetValidationIssueData {
  selectedConcepts: TerminologyCodeData
  valueSets: string[]
}

export type ValidationIssueData =
  | TimeRestrictionValidationIssueData
  | QuantityValidationIssueData
  | CriteriaSetValidationIssueData
  | ValueSetValidationIssueData;
