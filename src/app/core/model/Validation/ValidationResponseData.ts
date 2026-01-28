import { ValidationIssueData } from './ValidationIssueData';
import { ValidationValueData } from './ValidationErrorValue';

/**
 * Represents a validation error returned from the backend.
 */
export interface ValidationResponseData {
  details?: ValidationIssueData
  path: string
  value: ValidationValueData
}
