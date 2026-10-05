import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numButton } from '../component-objects/NumButton'
import { numModal } from '../component-objects/NumModal'

/**
 * Relocated from `cypress/e2e/CohorttResult/cohort-result.ts` — its
 * save-dialog steps (I see a dialog / I add the title / ... / I should see
 * the dialog closing) turned out to be shared with saved-queries.feature,
 * not cohort-result.feature-specific. Cucumber only auto-loads a step file
 * for a feature of the exact same basename, or for anything under
 * support/step_definitions/ (see cypress/CLAUDE.md) — a genuinely shared
 * step file has to live here, not next to one particular feature.
 */
export class CohortResult {
  public spinnerIsVisible() {
    numModal.shouldBeOpen('num-spinner')
  }

  public spinnerIsNotVisible() {
    numModal.shouldBeClosed('num-spinner')
  }

  public resultIsVisible() {
    // Feasibility computation time varies with backend load — a generous
    // retry timeout stays patient without blindly sleeping a fixed amount
    // every time the way the old `after {int} seconds` step did. The
    // timeout is bounded by the backend's own `.settings` config
    // (`passthroughPollingTimeUi`/`queryResultExpiry`, both PT1M in this
    // env — confirmed via `GET /.settings`, no auth needed): a real result
    // either arrives or the query expires within ~60s, so 70s covers a full
    // cycle plus slack. The spinner disappearing *is* the completion
    // signal, so it needs the same generous timeout as the "Number of
    // patients" check below, not the default ~4s.
    cy.get('num-spinner', { timeout: 70000 }).should('not.exist')
    cy.get('div', { timeout: 70000 }).contains('Number of patients').should('be.visible')
  }

  public openSaveDialog() {
    numModal.shouldBeOpen('num-save-dataquery-modal')
  }

  public addTitle(title: string) {
    // Typing while the dialog is still opening loses the text (the input is
    // re-initialised as the open animation ends, leaving it empty and "Save"
    // disabled). Wait for Material's opening state to end, then assert the value.
    cy.get('.mat-mdc-dialog-container')
      .should('have.class', 'mdc-dialog--open')
      .and('not.have.class', 'mdc-dialog--opening')
    cy.get('[data-cy="dialog-title-input"]').type(title).should('have.value', title)
  }

  public addComment(comment: string) {
    cy.get('[data-cy="dialog-comment-input"]').type(comment)
  }

  public saveCohort() {
    numButton.clickByText('num-save-dataquery-modal', 'Save')
  }

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
