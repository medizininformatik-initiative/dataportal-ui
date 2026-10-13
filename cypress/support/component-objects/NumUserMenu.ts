import { t } from '../i18n'

/**
 * Escape regex special characters in text.
 * */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Helper for header user menu (`num-header-user-menu`). Unlike `num-menu`, plain Material
 * `mat-select` with `mat-option`s: `NumMenu` `openMenu` / `.mat-mdc-menu-item` lookups cannot
 * reach it. Options match whole label because "Log" is substring of "Log Out".
 * */
export class NumUserMenu {
  /**
   * Open user menu select.
   * */
  public open() {
    cy.get('num-header-user-menu mat-select').click()
    cy.get('.mat-mdc-select-panel').should('be.visible')
  }

  /**
   * Find option by whole label.
   * */
  private option(label: string) {
    return cy.contains('.mat-mdc-option', new RegExp(`^\\s*${escapeRegex(label)}\\s*$`))
  }

  /**
   * Assert menu offers label.
   * */
  public shouldOffer(label: string) {
    this.option(label).should('be.visible')
  }

  /**
   * Assert menu item disabled.
   * */
  public shouldHaveItemDisabled(label: string) {
    this.option(label).should('have.attr', 'aria-disabled', 'true')
  }

  /**
   * Click menu item.
   * */
  public clickItem(label: string) {
    this.option(label).click()
  }

  /**
   * Assert about dialog shown.
   * */
  public shouldShowAboutDialog() {
    cy.get('mat-dialog-container')
      .should('be.visible')
      .and('contain', t('APPLAYOUT.HEADER.ABOUT_MODAL.BACKEND'))
  }

  /**
   * Logging out leaves app for Keycloak, different origin.
   * */
  public shouldBeOnSignInPage() {
    cy.origin(Cypress.expose('redirectUrl'), () => {
      cy.get('input[name=username]').should('be.visible')
    })
  }
}

export const numUserMenu = new NumUserMenu()
