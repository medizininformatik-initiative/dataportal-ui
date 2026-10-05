import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numErrorDisplay } from '../component-objects/NumErrorDisplay'

/** Steps for the error overlay (`num-error-display`) that failed requests open. */
defineStep('an error dialog is shown', () => numErrorDisplay.shouldBeOpen())
defineStep('no error dialog is shown', () => numErrorDisplay.shouldBeClosed())
defineStep('the error dialog is titled {string}', (title: string) =>
  numErrorDisplay.shouldHaveTitle(title)
)
defineStep('the error dialog shows {string}', (text: string) => numErrorDisplay.shouldContain(text))
defineStep('the error dialog does not show {string}', (text: string) =>
  numErrorDisplay.shouldNotContain(text)
)
defineStep('I close the error dialog', () => {
  numErrorDisplay.close()
  numErrorDisplay.shouldBeClosed()
})

/**
 * The error LOG dialog (`num-error-log-modal`) is a different overlay from the error dialog
 * above: it lists the backend's validation problems for a rejected upload.
 */
defineStep('the error log dialog is open', () => cy.get('num-error-log-modal').should('exist'))
defineStep('the error log shows {string}', (text: string) =>
  cy.get('num-error-log-modal').should('contain.text', text)
)
defineStep('I close the error log dialog', () => {
  cy.get('num-error-log-modal num-error-log-actions num-button').last().click()
  cy.get('num-error-log-modal').should('not.exist')
})
