import { defineStep } from '../defineStep'
import { numErrorDisplay } from '../component-objects/NumErrorDisplay'

/**
 * Error overlay (`num-error-display`) opened by failed requests. Also error LOG dialog
 * (`num-error-log-modal`): different overlay listing backend validation problems of rejected
 * upload.
 * */
export class ErrorDialog {
  /**
   * Assert error dialog open.
   * */
  public shouldBeOpen() {
    numErrorDisplay.shouldBeOpen()
  }

  /**
   * Assert error dialog closed.
   * */
  public shouldBeClosed() {
    numErrorDisplay.shouldBeClosed()
  }

  /**
   * Assert error dialog title.
   * */
  public shouldHaveTitle(title: string) {
    numErrorDisplay.shouldHaveTitle(title)
  }

  /**
   * Assert error dialog shows text.
   * */
  public shouldShow(text: string) {
    numErrorDisplay.shouldContain(text)
  }

  /**
   * Assert error dialog lacks text.
   * */
  public shouldNotShow(text: string) {
    numErrorDisplay.shouldNotContain(text)
  }

  /**
   * Close error dialog, assert closed.
   * */
  public close() {
    numErrorDisplay.close()
    numErrorDisplay.shouldBeClosed()
  }

  /**
   * Assert error log dialog exists.
   * */
  public logShouldBeOpen() {
    cy.get('num-error-log-modal').should('exist')
  }

  /**
   * Assert error log shows text.
   * */
  public logShouldShow(text: string) {
    cy.get('num-error-log-modal').should('contain.text', text)
  }

  /**
   * Click last button of error log actions, assert dialog gone.
   * */
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
