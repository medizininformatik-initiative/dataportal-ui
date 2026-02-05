/**
 * Quantity range validation issue details.
 */
export interface QuantityRangeValidationIssueData {
  type: 'quantity-range'
  valueFilter: {
    type: 'quantity-range'
    selectedConcepts: []
    unit: {
      code: string
      display: string
    }
    minValue: number
    maxValue: number
  }
}
