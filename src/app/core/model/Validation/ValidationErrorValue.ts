import { TerminologyCodeData } from '../../../model/Interface/TerminologyCodeData';

/**
 * Represents the value object of a validation error from the backend.
 */
export interface ValidationErrorValue {
  message: string
  code: string
  criteriaSets: string[]
  selected?: string
  allowed?: string[]
  termcode?: TerminologyCodeData
  valueSets?: string[]
}
