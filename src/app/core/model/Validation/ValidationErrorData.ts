import { ValidationIssueData } from './ValidationIssueData';

export interface ValidationErrorData {
  type: 'VALIDATION_ERROR'
  payload: ValidationIssueData[]
  url?: string
}
