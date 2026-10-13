import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'
import { numButton } from '../component-objects/NumButton'
import { numModal } from '../component-objects/NumModal'

/**
 * Steps for feasibility result and save-cohort dialog. Moved from
 * `cypress/e2e/CohorttResult/cohort-result.ts`: save-dialog steps are shared with
 * saved-queries.feature. Cucumber auto-loads step file only for same-basename feature or under
 * `support/step_definitions/` (see cypress/CLAUDE.md), so shared steps live here.
 * */
export class CohortResult {
  /**
   * Assert result spinner visible.
   * */
  public spinnerIsVisible() {
    numModal.shouldBeOpen('num-spinner')
  }

  /**
   * Assert result spinner gone.
   * */
  public spinnerIsNotVisible() {
    numModal.shouldBeClosed('num-spinner')
  }

  /**
   * Wait for feasibility result. Computation time varies with backend load, so use long retry
   * timeout, no fixed sleep. Timeout bound by backend `.settings` (`passthroughPollingTimeUi`,
   * `queryResultExpiry`, both PT1M here, from `GET /.settings`, no auth): result arrives or
   * query expires within ~60s, so 70s = full cycle plus slack. Spinner disappearing IS
   * completion signal: needs same long timeout as "Number of patients" check, not default ~4s.
   * */
  public resultIsVisible() {
    /**
     * Wait for feasibility result. Computation time varies with backend load, so use long retry
     * timeout, no fixed sleep. Timeout bound by backend `.settings` (`passthroughPollingTimeUi`,
     * `queryResultExpiry`, both PT1M here, from `GET /.settings`, no auth): result arrives or
     * query expires within ~60s, so 70s = full cycle plus slack. Spinner disappearing IS
     * completion signal: needs same long timeout as "Number of patients" check, not default ~4s.
     * */
    cy.get('num-spinner', { timeout: 70000 }).should('not.exist')
    cy.get('div', { timeout: 70000 }).contains('Number of patients').should('be.visible')
  }

  /**
   * Assert save-cohort dialog open.
   * */
  public openSaveDialog() {
    numModal.shouldBeOpen('num-save-dataquery-modal')
  }

  /**
   * Type title into save dialog.
   * */
  public addTitle(title: string) {
    /**
     * Typing while dialog still opens loses text: input re-initialises when open animation ends,
     * leaving it empty and "Save" disabled. Wait for Material opening state to end, then assert
     * value.
     * */
    cy.get('.mat-mdc-dialog-container')
      .should('have.class', 'mdc-dialog--open')
      .and('not.have.class', 'mdc-dialog--opening')
    cy.get(dataCy('dialog-title-input')).type(title).should('have.value', title)
  }

  /**
   * Type comment into save dialog.
   * */
  public addComment(comment: string) {
    cy.get(dataCy('dialog-comment-input')).type(comment)
  }

  /**
   * Click "Save" in save dialog.
   * */
  public saveCohort() {
    numButton.clickByText('num-save-dataquery-modal', 'Save')
  }

  /**
   * Assert save dialog closed.
   * */
  public shouldSeeDialogClosing() {
    numModal.shouldBeClosed('num-save-dataquery-modal')
  }
}

export const cohortResult = new CohortResult()
defineStep('I see the spinner is visible', () => cohortResult.spinnerIsVisible())
defineStep('I see the spinner is not visible', () => cohortResult.spinnerIsNotVisible())
defineStep('I see the result', () => cohortResult.resultIsVisible())
defineStep('I see a dialog', () => cohortResult.openSaveDialog())
defineStep('I add the title {string}', (title: string) => cohortResult.addTitle(title))
defineStep('I add the comment {string}', (comment: string) => cohortResult.addComment(comment))
defineStep('I save the cohort', () => cohortResult.saveCohort())
defineStep('I should see the dialog closing', () => cohortResult.shouldSeeDialogClosing())
