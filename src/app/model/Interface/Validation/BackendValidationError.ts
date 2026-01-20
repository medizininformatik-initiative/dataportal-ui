import { ValidationErrorValue } from './ValidationErrorValue';

/**
 * Represents a validation error returned from the backend.
 */
export interface ValidationResponseData {
  value: ValidationErrorValue
  path: string
}
