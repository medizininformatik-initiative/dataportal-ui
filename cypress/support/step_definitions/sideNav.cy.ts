import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { NavItemValue, NavItemPaths, NavItemBaseRoutes } from '../../e2e/Utilities/NavItems'
import { Page } from '../../e2e/Utilities/pages'
import { getUrlPathByPage } from '../../e2e/Utilities/pathResolver'

/**
 * Class for side navigation component tests.
 * @see NavItemValue
 */
export class SideNavTests {
  public navigateTo(navItemSelector: NavItemValue) {
    cy.get(`[data-cy="nav-${NavItemBaseRoutes[navItemSelector]}"]`).click()
    cy.url().should('include', NavItemPaths[navItemSelector])
  }

  public visitUrl(url: Page) {
    const resolvedUrl: string = getUrlPathByPage(url)
    cy.url().then((currentUrl) => {
      if (!currentUrl.includes(resolvedUrl)) {
        cy.visit(resolvedUrl)
      }
    })
    cy.url().should('include', resolvedUrl)
  }
}
export const sideNavTests = new SideNavTests()
defineStep('I navigate to the {string} page', (navItem: NavItemValue) => {
  sideNavTests.navigateTo(navItem)
})
defineStep('I am on the {string} page', (page: Page) => {
  sideNavTests.visitUrl(page)
})
