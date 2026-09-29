import { defineStep } from '@badeball/cypress-cucumber-preprocessor'
import { numMenu } from '../component-objects/NumMenu'

defineStep('I open the menu', () => numMenu.open())
defineStep('I click on the menu item {string}', (menuItem: string) => numMenu.clickItem(menuItem))
