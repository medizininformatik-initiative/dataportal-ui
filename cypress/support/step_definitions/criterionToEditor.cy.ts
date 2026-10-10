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
    cy.wait(1000) // wait for the editor to load
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
    cy.wait(1000) // wait for the editor to load
  }

  public shouldSeeCriteriumInEditor(criterium: string) {
    cy.get(`[data-cy="${criterium}"]`).within(() => {
      cy.get('.content').should('contain', criterium).should('contain', criterium)
    })
  }

  public dragCriteriumRightBy200px(type = "Inclusion") {
    const draggableSelector = '.cdk-drag'
    cy.wait(1000) // ensure UI is ready
    cy.get(draggableSelector).trigger('mousedown', {
      button: 0,
      timeout: 10000,
    })
    cy.get(`#${type}`)
      .trigger('mousemove', {
        timeout: 10000,
        waitForAnimations: true,
      })
      .click()
      cy.wait(1000)
  }
}

export const criterionToEditor = new CriterionToEditor()
defineStep('I add the criterium {string} to the editor', (criterium: string) => {criterionToEditor.addCriteriumToEditor(criterium)})
defineStep('I add the criterium {string} via code {string} to the editor', (criterium: string, code: string) => {criterionToEditor.addCriteriumToEditorByCode(resolve(code), resolve(criterium))})
defineStep('I should see the criterium {string} in the editor', (criterium: string) => {criterionToEditor.shouldSeeCriteriumInEditor(criterium)})
defineStep('I drag {string} criterium to the {string} list', (criterium: string, type: string) =>
  criterionToEditor.dragCriteriumRightBy200px(type)
)
