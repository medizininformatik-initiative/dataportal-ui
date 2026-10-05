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

// Side navigation state. The toggle is matched inside the nav list rather than by
// its aria-label, because that label is translated and follows the app's current
// language, not the language the suite runs in.
defineStep('I toggle the side navigation', () => {
  cy.get('mat-nav-list .num-logo-row button').click()
})
defineStep('the side navigation should be collapsed', () => {
  cy.get('mat-nav-list').should('have.class', 'collapsed')
})
defineStep('the side navigation should be expanded', () => {
  cy.get('mat-nav-list').should('not.have.class', 'collapsed')
})
defineStep('the side navigation should list {int} areas', (count: number) => {
  cy.get('mat-nav-list a.num-mat-list-item').should('have.length', count)
})
defineStep('the side navigation should show the label {string}', (label: string) => {
  cy.get('mat-nav-list .navItem-font').should('contain', label)
})
defineStep('the side navigation should show no labels', () => {
  cy.get('mat-nav-list .navItem-font').should('not.exist')
})
// Unlike `I am on the {string} page`, this never navigates: that step does a hard
// cy.visit() when the URL does not match, so used after a click it can hide a
// navigation that never happened. This one only asserts.
defineStep('I should arrive on the {string} page', (page: Page) => {
  cy.url().should('include', getUrlPathByPage(page))
})
