import { ErrorLog } from '../../Validation/ErrorLog';

/**
 * Represents the result of a validation operation.
 */
export interface ValidationResult {
  success: boolean
  errorLog?: ErrorLog
}
