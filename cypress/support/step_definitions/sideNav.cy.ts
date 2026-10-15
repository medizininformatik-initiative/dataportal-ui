import { defineStep } from "@badeball/cypress-cucumber-preprocessor";
import { NavItemValue, NavItemPaths } from "../../e2e/Utilities/NavItems";
import { UrlPaths } from "../e2e";
import { Page } from "../../e2e/Utilities/pages";
import { getUrlPathByPage } from "../../e2e/Utilities/pathResolver";

/**
 * Class for side navigation component tests.
 * @see NavItemValue
 */
export class SideNavTests {

  /**
   * "Kohortenselektion" | "Data Selection" | "Data Definition" | ".settings-link" | ".profile-link" | ".logout-link"
   * @param navItemSelector 
   */
  public navigateTo(navItemSelector: NavItemValue) {
    cy.get('num-side-menu')
      .should('be.visible')
      .within(() => {
        cy.contains(navItemSelector).click().then(() => {
          cy.url().should('include', NavItemPaths[navItemSelector]);
        })
      });
  }

public visitUrl(url: Page) {
  const resolvedUrl: string = getUrlPathByPage(url);

  cy.url().then((currentUrl) => {
    if (currentUrl.includes(resolvedUrl)) {
      // Already on the correct page
      expect(true).to.be.true;
    } else {
      // Navigate to the desired page
      cy.visit(resolvedUrl);
      cy.url().should('include', resolvedUrl);
    }
  });
  cy.wait(1000);
}
}
export const sideNavTests = new SideNavTests();
defineStep('I navigate to the {string} page', (navItem: NavItemValue) => {
  sideNavTests.navigateTo(navItem);
})
defineStep('I am on the {string} page', (page: Page) => {
  sideNavTests.visitUrl(page)
});
