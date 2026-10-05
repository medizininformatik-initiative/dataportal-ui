import { defineStep } from "@badeball/cypress-cucumber-preprocessor"
import { resolve } from "../testData"
import { CriterionSearch } from "../../e2e/CohortSearch/cohort-search"

export class CriterionToEditor {
  public addCriteriumToEditor(criterium: string) {
    const criterionSearchInstance = new CriterionSearch()
    criterionSearchInstance.searchInput(criterium)
    criterionSearchInstance.selectCriterion(criterium)
    criterionSearchInstance.selectActioBarButton('Add')
    criterionSearchInstance.selectActioBarButton('Show')
    // The criteria-box rendering is the editor's own "loaded" signal
    cy.get(`.container[data-cy="${criterium}"]`).should('be.visible')
  }

  /**
   * Same flow as `addCriteriumToEditor`, but searches by the criterium's own
   * termcode rather than its display text. Some criteria don't rank within
   * the app's own top-20 free-text search results for their own display name
   * (confirmed for "Age" — the backend ranks substring matches like "Ageусie"
   * far above the exact term; see cypress/TEST_DATA.md), even though the
   * criterium itself is valid. The search bar explicitly supports code
   * lookup ("Enter code or search term"), and a code match is a single,
   * deterministic result — use this instead of fighting the ranking.
   */
  public addCriteriumToEditorByCode(code: string, expectedDisplayText: string) {
    const criterionSearchInstance = new CriterionSearch()
    criterionSearchInstance.searchInput(code)
    criterionSearchInstance.selectCriterion(expectedDisplayText)
    criterionSearchInstance.selectActioBarButton('Add')
    criterionSearchInstance.selectActioBarButton('Show')
    cy.get(`.container[data-cy="${expectedDisplayText}"]`).should('be.visible')
  }

  public shouldSeeCriteriumInEditor(criterium: string) {
    cy.get(`[data-cy="${criterium}"]`).within(() => {
      cy.get('.content').should('contain', criterium).should('contain', criterium)
    })
  }

  public dragCriteriumRightBy200px(type = "Inclusion") {
    // A synthetic mousedown only starts a CDK drag when its target is inside a
    // cdkDragHandle, and the criteria-box root is not one — use its content block.
    const draggableSelector = '[data-cy="criterion-content"]'
    cy.get(draggableSelector).should('be.visible').trigger('mousedown', {
      button: 0,
      timeout: 10000,
    })
    cy.get(`#${type}`)
      .trigger('mousemove', {
        timeout: 10000,
        waitForAnimations: true,
      })
      .click()
    // No fixed wait: the scenario's next step asserts the resulting UI state, and Cypress retries it
  }
}

export const criterionToEditor = new CriterionToEditor()
defineStep('I add the criterium {string} to the editor', (criterium: string) => {criterionToEditor.addCriteriumToEditor(criterium)})
defineStep('I add the criterium {string} via code {string} to the editor', (criterium: string, code: string) => {criterionToEditor.addCriteriumToEditorByCode(resolve(code), resolve(criterium))})
defineStep('I should see the criterium {string} in the editor', (criterium: string) => {criterionToEditor.shouldSeeCriteriumInEditor(criterium)})
defineStep('I drag {string} criterium to the {string} list', (criterium: string, type: string) =>
  criterionToEditor.dragCriteriumRightBy200px(type)
)
