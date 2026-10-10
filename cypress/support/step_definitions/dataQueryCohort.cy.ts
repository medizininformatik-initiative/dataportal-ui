import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

// Shared by data-query-cohort.feature and saved-queries.feature — did not
// exist anywhere before this pass (grepped every defineStep in the codebase).
defineStep('I should see {string} in the cohort definition editor', (criterium: string) => {
  cy.get('num-display-feasibility-query').should('contain', criterium)
})
