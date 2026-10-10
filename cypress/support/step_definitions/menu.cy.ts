import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numMenu } from '../component-objects/NumMenu'

defineStep('I open the menu', () => numMenu.open())
defineStep('the menu should offer the item {string}', (menuItem: string) =>
  numMenu.shouldOfferItem(menuItem)
)
defineStep('I click on the menu item {string}', (menuItem: string) => numMenu.clickItem(menuItem))
