import { t } from '../i18n'

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Helper for the header's user menu (`num-header-user-menu`). Unlike
 * `num-menu`, it is a plain Angular Material `mat-select` whose options are
 * `mat-option`s, so `NumMenu`'s `openMenu` / `.mat-mdc-menu-item` lookups cannot
 * reach it. Options are matched by their whole label, because "Log" is a
 * substring of "Log Out".
 */
export class NumUserMenu {
  public open() {
    cy.get('num-header-user-menu mat-select').click()
    cy.get('.mat-mdc-select-panel').should('be.visible')
  }

  private option(label: string) {
    return cy.contains('.mat-mdc-option', new RegExp(`^\\s*${escapeRegex(label)}\\s*$`))
  }

  public shouldOffer(label: string) {
    this.option(label).should('be.visible')
  }

  public shouldHaveItemDisabled(label: string) {
    this.option(label).should('have.attr', 'aria-disabled', 'true')
  }

  public clickItem(label: string) {
    this.option(label).click()
  }

  public shouldShowAboutDialog() {
    cy.get('mat-dialog-container')
      .should('be.visible')
      .and('contain', t('APPLAYOUT.HEADER.ABOUT_MODAL.BACKEND'))
  }

  /** Logging out leaves the app for Keycloak, a different origin. */
  public shouldBeOnSignInPage() {
    cy.origin(Cypress.expose('redirectUrl'), () => {
      cy.get('input[name=username]').should('be.visible')
    })
  }
}

export const numUserMenu = new NumUserMenu()
