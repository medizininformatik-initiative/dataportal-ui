import { defineStep } from '../defineStep'
import { numButton } from '../component-objects/NumButton'

const scope = 'num-action-bar'

// num-action-bar's buttons are icon-only by design (tooltip, no visible
// text) — a generic text-matching step can't find them. Rather than rename
// the Gherkin's readable "Save cohort" to match the tooltip's actual text
// ("Save"), map the few known icon-only names here to their data-cy.
const ICON_ONLY_BUTTONS: Record<string, string> = {
  'save cohort': 'save-cohort-button',
}

export class ActionBar {
  private iconOnlyButton(buttonName: string) {
    const dataCy = ICON_ONLY_BUTTONS[buttonName.trim().toLowerCase()]
    return dataCy ? cy.get(scope).find(`[data-cy="${dataCy}"]`) : null
  }

  public shouldBeDisabled(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.should('be.disabled')
    else numButton.shouldBeDisabled(scope, buttonName.trim(), false)
  }

  public shouldBeEnabled(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.should('not.be.disabled')
    else numButton.shouldBeEnabled(scope, buttonName.trim(), false)
  }

  public click(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.click()
    else numButton.clickByText(scope, buttonName.trim(), false)
  }

  // The upload <input type=file> is visually hidden behind its icon button, so it
  // only has to exist; download and save are real buttons and must be visible.
  public shouldOfferUploadDownloadAndSave() {
    cy.get(scope).find('[data-cy="upload-crtdl"]').should('exist')
    cy.get(scope).find('[data-cy="download-crtdl-button"]').should('be.visible')
    cy.get(scope).find('[data-cy="save-cohort-button"]').should('be.visible')
  }

  public shouldOfferNoUploadDownloadOrSave() {
    cy.get(scope).should('exist')
    cy.get(scope).find('[data-cy="upload-crtdl"]').should('not.exist')
    cy.get(scope).find('[data-cy="download-crtdl-button"]').should('not.exist')
    cy.get(scope).find('[data-cy="save-cohort-button"]').should('not.exist')
  }
}

export const actionBar = new ActionBar()

defineStep('the button {string} should be disabled', (buttonName: string) =>
  actionBar.shouldBeDisabled(buttonName)
)
defineStep('the button {string} should be enabled', (buttonName: string) =>
  actionBar.shouldBeEnabled(buttonName)
)
defineStep('I click on the button {string}', (buttonName: string) => actionBar.click(buttonName))
defineStep('the action bar offers upload, download and save', () =>
  actionBar.shouldOfferUploadDownloadAndSave()
)
defineStep('the action bar offers no upload, download or save', () =>
  actionBar.shouldOfferNoUploadDownloadOrSave()
)
