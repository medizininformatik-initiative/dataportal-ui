import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

/**
 * Generic Inclusion/Exclusion list existence checks — parametrized by list
 * name so the same steps serve both groups (display.component.html renders
 * them as sibling id="Inclusion"/id="Exclusion" containers), not
 * Exclusion-specific.
 */
defineStep(
  'I should see the criterium {string} in the {string} list',
  (criterium: string, list: string) => {
    cy.get(`#${list}`).should('contain', criterium)
  }
)
defineStep(
  'I should not see the criterium {string} in the {string} list',
  (criterium: string, list: string) => {
    cy.get(`#${list}`).should('not.contain', criterium)
  }
)
