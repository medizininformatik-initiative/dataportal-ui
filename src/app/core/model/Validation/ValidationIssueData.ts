import { ValidationIssueType } from './ValidationIssueType';
import { ValidationMessageData } from './ValidationMessageData';

/**
 * Represents a validation error returned from the backend.
 */
export interface ValidationIssueData {
  details?: ValidationIssueType
  path: string
  value: ValidationMessageData
}
