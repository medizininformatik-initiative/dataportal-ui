import { dataCy } from '../dataCy'
import { MenuItemValue } from '../../e2e/Utilities/menuItems'

const MAT_MDC_MENU_CONTENT_VISIBLE = '.mat-mdc-menu-content:visible'
const MAT_MDC_MENU_ITEM = '.mat-mdc-menu-item'

/**
 * Query and interaction helper for `num-menu` shared component. Moved from
 * `cypress/support/step_definitions/menu.cy.ts`. Inner `.mat-mdc-menu-content` /
 * MAT_MDC_MENU_ITEM are Material generated DOM: no template of ours for `data-cy`, so
 * `cy.contains()` stays (cypress/CLAUDE.md data-cy principle). Trigger already has
 * `data-cy="openMenu"`.
 * */
export class NumMenu {
  /**
   * Click menu trigger.
   * */
  public open() {
    cy.get(dataCy('openMenu')).click()
  }

  /**
   * Assert menu offers item.
   * */
  public shouldOfferItem(menuItemLabel: MenuItemValue) {
    cy.get(MAT_MDC_MENU_CONTENT_VISIBLE)
      .should('exist')
      .within(() => {
        cy.get(MAT_MDC_MENU_ITEM).contains(menuItemLabel).should('be.visible')
      })
  }

  /**
   * Click menu item.
   * */
  public clickItem(menuItemLabel: MenuItemValue) {
    cy.get(MAT_MDC_MENU_CONTENT_VISIBLE)
      .should('exist')
      .within(() => {
        cy.get(MAT_MDC_MENU_ITEM).contains(menuItemLabel).should('be.visible').click()
      })
  }
}

export const numMenu = new NumMenu()
