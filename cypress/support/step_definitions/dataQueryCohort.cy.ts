import { defineStep } from '../defineStep'

/**
 * Shared by data-query-cohort.feature and saved-queries.feature. Did not exist before (grepped
 * every `defineStep`).
 * */
export class DataQueryCohort {
  /**
   * Assert cohort definition editor shows criterium.
   * */
  public shouldShowInEditor(criterium: string) {
    cy.get('num-display-feasibility-query').should('contain', criterium)
  }
}

export const dataQueryCohort = new DataQueryCohort()

defineStep('I should see {string} in the cohort definition editor', (criterium: string) =>
  dataQueryCohort.shouldShowInEditor(criterium)
)
