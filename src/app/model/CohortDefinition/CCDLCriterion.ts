import { CCDLAttributeFilter, CCDLValueFilter } from './CCDLFilters'
import { CCDLTermCode, NonEmptyArray } from './CCDLTermCode'
import { CCDLTimeRestriction } from './CCDLTimeRestriction'

/**
 * One concept a cohort is selected by, optionally narrowed by a time restriction and filters.
 *
 * @see `$defs/criterion` in the CCDL v1 schema.
 */
export interface CCDLCriterion {
  /**
   * The module the concept belongs to (e.g. `Condition`), not the terminology system.
   */
  context: CCDLTermCode

  /**
   * The concept itself. At least one.
   */
  termCodes: NonEmptyArray<CCDLTermCode>

  /**
   * The interval the criterion has to be fulfilled in.
   */
  timeRestriction?: CCDLTimeRestriction

  /**
   * A filter on the criterion's own value, such as the age of a patient.
   */
  valueFilter?: CCDLValueFilter

  /**
   * Filters on attributes of the resource, such as the cause of death or a referenced medication.
   */
  attributeFilters?: CCDLAttributeFilter[]
}
