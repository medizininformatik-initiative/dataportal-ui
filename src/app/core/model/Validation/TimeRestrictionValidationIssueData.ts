/**
 * Time restriction validation issue details.
 */
export interface TimeRestrictionValidationIssueData {
  type: 'time-restriction'
  timeRestriction: {
    afterDate: string
    beforeDate: string
  }
}
