import { CCDLCriterion } from './CCDLCriterion'
import { NonEmptyArray } from './CCDLTermCode'

/**
 * The root of a CCDL v1 document: the `cohortDefinition` of a CRTDL.
 *
 * Inclusion and exclusion criteria are combined with AND NOT. Within each, the two list levels read
 * as follows:
 *
 * - `inclusionCriteria`: the outer list is joined with AND, each inner list with OR.
 * - `exclusionCriteria`: the outer list is joined with OR, each inner list with AND.
 *
 * @see the root of the CCDL v1 schema.
 */
export interface CCDLCohortDefinition {
  /**
   * Version identifier with a reference to a schema. Any URI is valid in v1, and the frontend never
   * reads it.
   */
  version: string

  /**
   * Display text of the cohort definition.
   */
  display?: string

  /**
   * The criteria a patient must meet. At least one group of at least one criterion.
   * @typedef {NonEmptyArray<NonEmptyArray<CCDLCriterion>>}
   */
  inclusionCriteria: NonEmptyArray<NonEmptyArray<CCDLCriterion>>

  /**
   * The criteria that exclude a patient. Omitted when nothing is excluded; an empty list is invalid.
   */
  exclusionCriteria?: NonEmptyArray<NonEmptyArray<CCDLCriterion>>
}
