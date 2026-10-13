import { MenuItemValue } from '../../e2e/Utilities/menuItems'

/**
 * Query and interaction helper for `num-menu` shared component. Moved from
 * `cypress/support/step_definitions/menu.cy.ts`. Inner `.mat-mdc-menu-content` /
 * `.mat-mdc-menu-item` are Material generated DOM: no template of ours for `data-cy`, so
 * `cy.contains()` stays (cypress/CLAUDE.md data-cy principle). Trigger already has
 * `data-cy="openMenu"`.
 * */
export class NumMenu {
  /**
   * Click menu trigger.
   * */
  public open() {
    cy.get('[data-cy="openMenu"]').click()
  }

  /**
   * Assert menu offers item.
   * */
  public shouldOfferItem(menuItemLabel: MenuItemValue) {
    cy.get('.mat-mdc-menu-content:visible')
      .should('exist')
      .within(() => {
        cy.get('.mat-mdc-menu-item').contains(menuItemLabel).should('be.visible')
      })
  }

  /**
   * Click menu item.
   * */
  public clickItem(menuItemLabel: MenuItemValue) {
    cy.get('.mat-mdc-menu-content:visible')
      .should('exist')
      .within(() => {
        cy.get('.mat-mdc-menu-item').contains(menuItemLabel).should('be.visible').click()
      })
  }
}

export const numMenu = new NumMenu()
