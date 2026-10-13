import { defineStep } from '../defineStep'
import { numErrorDisplay } from '../component-objects/NumErrorDisplay'

/**
 * The error overlay (`num-error-display`) that failed requests open, and the error LOG dialog
 * (`num-error-log-modal`): a different overlay that lists the backend's validation problems for a
 * rejected upload.
 */
export class ErrorDialog {
  public shouldBeOpen() {
    numErrorDisplay.shouldBeOpen()
  }

  public shouldBeClosed() {
    numErrorDisplay.shouldBeClosed()
  }

  public shouldHaveTitle(title: string) {
    numErrorDisplay.shouldHaveTitle(title)
  }

  public shouldShow(text: string) {
    numErrorDisplay.shouldContain(text)
  }

  public shouldNotShow(text: string) {
    numErrorDisplay.shouldNotContain(text)
  }

  public close() {
    numErrorDisplay.close()
    numErrorDisplay.shouldBeClosed()
  }

  public logShouldBeOpen() {
    cy.get('num-error-log-modal').should('exist')
  }

  public logShouldShow(text: string) {
    cy.get('num-error-log-modal').should('contain.text', text)
  }

  public closeLog() {
    cy.get('num-error-log-modal num-error-log-actions num-button').last().click()
    cy.get('num-error-log-modal').should('not.exist')
  }
}

export const errorDialog = new ErrorDialog()

defineStep('an error dialog is shown', () => errorDialog.shouldBeOpen())
defineStep('no error dialog is shown', () => errorDialog.shouldBeClosed())
defineStep('the error dialog is titled {string}', (title: string) =>
  errorDialog.shouldHaveTitle(title)
)
defineStep('the error dialog shows {string}', (text: string) => errorDialog.shouldShow(text))
defineStep('the error dialog does not show {string}', (text: string) =>
  errorDialog.shouldNotShow(text)
)
defineStep('I close the error dialog', () => errorDialog.close())
defineStep('the error log dialog is open', () => errorDialog.logShouldBeOpen())
defineStep('the error log shows {string}', (text: string) => errorDialog.logShouldShow(text))
defineStep('I close the error log dialog', () => errorDialog.closeLog())
