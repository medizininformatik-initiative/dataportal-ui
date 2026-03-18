import { CodeMessageData } from '../CodeMessageData';
import { ValidationIssueType } from './ValidationIssueType';

/**
 * Represents a validation error returned from the backend.
 */
export interface ValidationIssueData {
  details?: ValidationIssueType
  path: string
  value: CodeMessageData
}
