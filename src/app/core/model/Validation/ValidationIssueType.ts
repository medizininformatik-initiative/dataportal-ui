import { CriteriaSetValidationIssueData } from './CriteriaSetValidationIssueData'
import { DataExtractionValidationIssueData } from './DataExtractionValidationIssueData'
import { QuantityRangeValidationIssueData } from './QuantityRangeValidationIssueData'
import { QuantityUnitValidationIssueData } from './QuantityUnitValidationIssueData'
import { TimeRestrictionValidationIssueData } from './TimeRestrictionValidationIssueData'
import { ValueSetValidationIssueData } from './ValueSetValidationIssueData'

/**
 * Discriminated union of all validation issue types.
 * Use the 'type' field for type narrowing.
 */
export type ValidationIssueType =
  | TimeRestrictionValidationIssueData
  | QuantityUnitValidationIssueData
  | CriteriaSetValidationIssueData
  | ValueSetValidationIssueData
  | QuantityRangeValidationIssueData
  | DataExtractionValidationIssueData
