import { MenuItemValue } from '../../e2e/Utilities/menuItems'

/**
 * Query/interaction helper for the `num-menu` shared component. Relocated
 * from `cypress/support/step_definitions/menu.cy.ts`. Its internal
 * `.mat-mdc-menu-content`/`.mat-mdc-menu-item` are Angular Material's own
 * generated DOM — no template of ours to attach `data-cy` to, so these stay
 * `cy.contains()` per cypress/CLAUDE.md's data-cy principle; the trigger
 * itself already has `data-cy="openMenu"`.
 */
export class NumMenu {
  public open() {
    cy.get('[data-cy="openMenu"]').click()
  }

  public clickItem(menuItemLabel: MenuItemValue) {
    cy.get('.mat-mdc-menu-content:visible')
      .should('exist')
      .within(() => {
        cy.get('.mat-mdc-menu-item').contains(menuItemLabel).should('be.visible').click()
      })
  }
}

export const numMenu = new NumMenu()
