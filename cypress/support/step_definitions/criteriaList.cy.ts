import { defineStep } from '../defineStep'

/**
 * Generic Inclusion/Exclusion list checks — parametrized by list name so the same steps serve
 * both groups (display.component.html renders them as sibling id="Inclusion"/id="Exclusion"
 * containers), not Exclusion-specific.
 */
export class CriteriaList {
  public shouldContain(criterium: string, list: string) {
    cy.get(`#${list}`).should('contain', criterium)
  }

  public shouldNotContain(criterium: string, list: string) {
    cy.get(`#${list}`).should('not.contain', criterium)
  }

  // A criterium's box is the `.container` carrying its display text as data-cy
  // (see cypress/CLAUDE.md, "A value filter's chip can share its data-cy ...").
  public shouldHaveCriteriaNamed(count: number, criterium: string) {
    cy.get(`.container[data-cy="${criterium}"]`).should('have.length', count)
  }

  // Each criterium in a list is one `.cdk-drag` (the same handle the drag step grabs).
  public shouldHaveCount(list: string, count: number) {
    cy.get(`#${list} .cdk-drag`).should('have.length', count)
  }
}

export const criteriaList = new CriteriaList()

defineStep(
  'I should see the criterium {string} in the {string} list',
  (criterium: string, list: string) => criteriaList.shouldContain(criterium, list)
)
defineStep(
  'I should see {int} criteria named {string} in the editor',
  (count: number, criterium: string) => criteriaList.shouldHaveCriteriaNamed(count, criterium)
)
defineStep(
  'I should not see the criterium {string} in the {string} list',
  (criterium: string, list: string) => criteriaList.shouldNotContain(criterium, list)
)
defineStep('the {string} list should contain {int} criteria', (list: string, count: number) =>
  criteriaList.shouldHaveCount(list, count)
)
