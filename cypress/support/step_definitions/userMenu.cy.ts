import { defineStep } from '../defineStep'
import { numUserMenu } from '../component-objects/NumUserMenu'

export class UserMenu {
  public open() {
    numUserMenu.open()
  }

  public shouldOffer(label: string) {
    numUserMenu.shouldOffer(label)
  }

  public shouldHaveItemDisabled(label: string) {
    numUserMenu.shouldHaveItemDisabled(label)
  }

  public clickItem(label: string) {
    numUserMenu.clickItem(label)
  }

  public shouldShowAboutDialog() {
    numUserMenu.shouldShowAboutDialog()
  }

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
