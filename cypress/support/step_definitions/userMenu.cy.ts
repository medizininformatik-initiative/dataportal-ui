import { defineStep } from '../defineStep'
import { numUserMenu } from '../component-objects/NumUserMenu'

/**
 * Steps for user menu.
 * */
export class UserMenu {
  /**
   * Open user menu.
   * */
  public open() {
    numUserMenu.open()
  }

  /**
   * Assert user menu offers label.
   * */
  public shouldOffer(label: string) {
    numUserMenu.shouldOffer(label)
  }

  /**
   * Assert user menu item disabled.
   * */
  public shouldHaveItemDisabled(label: string) {
    numUserMenu.shouldHaveItemDisabled(label)
  }

  /**
   * Click user menu item.
   * */
  public clickItem(label: string) {
    numUserMenu.clickItem(label)
  }

  /**
   * Assert about dialog shown.
   * */
  public shouldShowAboutDialog() {
    numUserMenu.shouldShowAboutDialog()
  }

  /**
   * Assert sign-in page reached.
   * */
  public shouldBeOnSignInPage() {
    numUserMenu.shouldBeOnSignInPage()
  }
}

export const userMenu = new UserMenu()

defineStep('I open the user menu', () => userMenu.open())
defineStep('the user menu should offer {string}', (label: string) => userMenu.shouldOffer(label))
defineStep('the user menu item {string} should be disabled', (label: string) =>
  userMenu.shouldHaveItemDisabled(label)
)
defineStep('I click on the user menu item {string}', (label: string) => userMenu.clickItem(label))
defineStep('I should see the about dialog', () => userMenu.shouldShowAboutDialog())
defineStep('I should be on the sign-in page', () => userMenu.shouldBeOnSignInPage())
