import { defineStep } from '../defineStep'
import { resolve } from '../testData'
import { CriterionSearch } from '../../e2e/CohortSearch/cohort-search'

/**
 * Add criteria to editor via search, show them, drag between lists.
 * */
export class CriterionToEditor {
  /**
   * Search criterium by display text, add it, open editor.
   * */
  public addCriteriumToEditor(criterium: string) {
    const criterionSearchInstance = new CriterionSearch()
    criterionSearchInstance.searchInput(criterium)
    criterionSearchInstance.selectCriterion(criterium)
    criterionSearchInstance.selectActioBarButton('Add')
    criterionSearchInstance.selectActioBarButton('Show')
    /**
     * Wait for editor to load.
     * */
    cy.wait(1000)
  }

  /**
   * Same flow as `addCriteriumToEditor`, searching by own termcode instead of display text. Some
   * criteria rank outside app top-20 free-text results for own display name (confirmed for
   * "Age": backend ranks substring matches like "Ageusie" far above exact term, see
   * cypress/TEST_DATA.md) though valid. Search bar supports code lookup ("Enter code or search
   * term"), code match = one deterministic result: use it instead of fighting ranking.
   * */
  public addCriteriumToEditorByCode(code: string, expectedDisplayText: string) {
    const criterionSearchInstance = new CriterionSearch()
    criterionSearchInstance.searchInput(code)
    criterionSearchInstance.selectCriterion(expectedDisplayText)
    criterionSearchInstance.selectActioBarButton('Add')
    criterionSearchInstance.selectActioBarButton('Show')
    /**
     * Wait for editor to load.
     * */
    cy.wait(1000)
  }

  /**
   * Assert criterium shown in editor content.
   * */
  public shouldSeeCriteriumInEditor(criterium: string) {
    cy.get(`[data-cy="${criterium}"]`).within(() => {
      cy.get('.content').should('contain', criterium).should('contain', criterium)
    })
  }

  /**
   * Drag first draggable criterium into `type` list.
   * */
  public dragCriteriumRightBy200px(type = 'Inclusion') {
    const draggableSelector = '.cdk-drag'
    /**
     * Wait for UI ready.
     * */
    cy.wait(1000)
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

defineStep('I add the criterium {string} to the editor', (criterium: string) =>
  criterionToEditor.addCriteriumToEditor(criterium)
)
defineStep(
  'I add the criterium {string} via code {string} to the editor',
  (criterium: string, code: string) =>
    criterionToEditor.addCriteriumToEditorByCode(resolve(code), resolve(criterium))
)
defineStep('I should see the criterium {string} in the editor', (criterium: string) =>
  criterionToEditor.shouldSeeCriteriumInEditor(criterium)
)
defineStep('I drag {string} criterium to the {string} list', (_criterium: string, type: string) =>
  criterionToEditor.dragCriteriumRightBy200px(type)
)
