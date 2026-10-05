import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numUserMenu } from '../component-objects/NumUserMenu'

defineStep('I open the user menu', () => numUserMenu.open())
defineStep('the user menu should offer {string}', (label: string) => numUserMenu.shouldOffer(label))
defineStep('the user menu item {string} should be disabled', (label: string) =>
  numUserMenu.shouldHaveItemDisabled(label)
)
defineStep('I click on the user menu item {string}', (label: string) =>
  numUserMenu.clickItem(label)
)
defineStep('I should see the about dialog', () => numUserMenu.shouldShowAboutDialog())
defineStep('I should be on the sign-in page', () => numUserMenu.shouldBeOnSignInPage())
