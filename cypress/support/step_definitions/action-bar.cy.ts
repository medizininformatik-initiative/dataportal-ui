import { dataCy, Hook } from '../dataCy'
import { defineStep } from '../defineStep'
import { numButton } from '../component-objects/NumButton'

const scope = 'num-action-bar'

/**
 * Action-bar buttons are icon-only: tooltip, no visible text. Text-matching steps cannot find
 * them. Map known icon-only names to their `data-cy` instead of renaming Gherkin "Save cohort"
 * to tooltip text "Save".
 * */
const ICON_ONLY_BUTTONS: Record<string, Hook> = {
  'save cohort': 'save-cohort-button',
}

/**
 * Steps for buttons and offered actions of `num-action-bar`.
 * */
export class ActionBar {
  /**
   * Find icon-only button by Gherkin name. Return null for text buttons.
   * */
  private iconOnlyButton(buttonName: string) {
    const hook = ICON_ONLY_BUTTONS[buttonName.trim().toLowerCase()]
    return hook ? cy.get(scope).find(dataCy(hook)) : null
  }

  /**
   * Assert button disabled.
   * */
  public shouldBeDisabled(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.should('be.disabled')
    else numButton.shouldBeDisabled(scope, buttonName.trim(), false)
  }

  /**
   * Assert button enabled.
   * */
  public shouldBeEnabled(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.should('not.be.disabled')
    else numButton.shouldBeEnabled(scope, buttonName.trim(), false)
  }

  /**
   * Click button.
   * */
  public click(buttonName: string) {
    const iconOnly = this.iconOnlyButton(buttonName)
    if (iconOnly) iconOnly.click()
    else numButton.clickByText(scope, buttonName.trim(), false)
  }

  /**
   * Upload `<input type=file>` hides behind icon button, so must only exist. Download and save
   * are real buttons, must be visible.
   * */
  public shouldOfferUploadDownloadAndSave() {
    cy.get(scope).find(dataCy('upload-crtdl')).should('exist')
    cy.get(scope).find(dataCy('download-crtdl-button')).should('be.visible')
    cy.get(scope).find(dataCy('save-cohort-button')).should('be.visible')
  }

  /**
   * Assert upload, download and save are all absent.
   * */
  public shouldOfferNoUploadDownloadOrSave() {
    cy.get(scope).should('exist')
    cy.get(scope).find(dataCy('upload-crtdl')).should('not.exist')
    cy.get(scope).find(dataCy('download-crtdl-button')).should('not.exist')
    cy.get(scope).find(dataCy('save-cohort-button')).should('not.exist')
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
