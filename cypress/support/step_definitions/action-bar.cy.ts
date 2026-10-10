import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numButton } from '../component-objects/NumButton'

const scope = 'num-action-bar'

// num-action-bar's buttons are icon-only by design (tooltip, no visible
// text) — a generic text-matching step can't find them. Rather than rename
// the Gherkin's readable "Save cohort" to match the tooltip's actual text
// ("Save"), map the few known icon-only names here to their data-cy.
const ICON_ONLY_BUTTONS: Record<string, string> = {
  'save cohort': 'save-cohort-button',
}

function findActionBarButton(buttonName: string) {
  const dataCy = ICON_ONLY_BUTTONS[buttonName.trim().toLowerCase()]
  return dataCy ? cy.get(scope).find(`[data-cy="${dataCy}"]`) : null
}

defineStep('the button {string} should be disabled', (buttonName: string) => {
  const iconOnly = findActionBarButton(buttonName)
  if (iconOnly) {
    iconOnly.should('be.disabled')
  } else {
    numButton.shouldBeDisabled(scope, buttonName.trim(), false)
  }
})
defineStep('the button {string} should be enabled', (buttonName: string) => {
  const iconOnly = findActionBarButton(buttonName)
  if (iconOnly) {
    iconOnly.should('not.be.disabled')
  } else {
    numButton.shouldBeEnabled(scope, buttonName.trim(), false)
  }
})
defineStep('I click on the button {string}', (buttonName: string) => {
  const iconOnly = findActionBarButton(buttonName)
  if (iconOnly) {
    iconOnly.click()
  } else {
    numButton.clickByText(scope, buttonName.trim(), false)
  }
})
