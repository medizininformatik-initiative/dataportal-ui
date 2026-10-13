import { dataCyOf } from '../dataCy'
import { defineStep } from '../defineStep'

/**
 * Inclusion/Exclusion list checks. Parametrized by list name, serves both groups
 * (display.component.html renders sibling `id="Inclusion"` / `id="Exclusion"` containers).
 * */
export class CriteriaList {
  /**
   * Assert list contains criterium.
   * */
  public shouldContain(criterium: string, list: string) {
    cy.get(`#${list}`).should('contain', criterium)
  }

  /**
   * Assert list lacks criterium.
   * */
  public shouldNotContain(criterium: string, list: string) {
    cy.get(`#${list}`).should('not.contain', criterium)
  }

  /**
   * Criterium box = `.container` carrying display text as `data-cy` (see cypress/CLAUDE.md, section on
   * value filter chip sharing data-cy).
   * */
  public shouldHaveCriteriaNamed(count: number, criterium: string) {
    cy.get(dataCyOf(criterium, '.container')).should('have.length', count)
  }

  /**
   * Each criterium in list is one `.cdk-drag`, same handle drag step grabs.
   * */
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
