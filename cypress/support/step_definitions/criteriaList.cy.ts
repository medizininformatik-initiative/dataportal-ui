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
// A criterium's box is the `.container` carrying its display text as data-cy
// (see cypress/CLAUDE.md, "A value filter's chip can share its data-cy ...").
defineStep(
  'I should see {int} criteria named {string} in the editor',
  (count: number, criterium: string) => {
    cy.get(`.container[data-cy="${criterium}"]`).should('have.length', count)
  }
)
defineStep(
  'I should not see the criterium {string} in the {string} list',
  (criterium: string, list: string) => {
    cy.get(`#${list}`).should('not.contain', criterium)
  }
)
