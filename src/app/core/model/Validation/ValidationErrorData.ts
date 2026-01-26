import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';

export interface ValidationErrorData {
  type: 'VALIDATION_ERROR'
  payload: ValidationResponseData[]
  url?: string
}
