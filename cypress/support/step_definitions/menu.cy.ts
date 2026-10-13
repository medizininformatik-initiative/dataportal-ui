import { defineStep } from '../defineStep'
import { numMenu } from '../component-objects/NumMenu'

export class Menu {
  public open() {
    numMenu.open()
  }

  public shouldOfferItem(menuItem: string) {
    numMenu.shouldOfferItem(menuItem)
  }

  public clickItem(menuItem: string) {
    numMenu.clickItem(menuItem)
  }
}

export const menu = new Menu()

defineStep('I open the menu', () => menu.open())
defineStep('the menu should offer the item {string}', (menuItem: string) =>
  menu.shouldOfferItem(menuItem)
)
defineStep('I click on the menu item {string}', (menuItem: string) => menu.clickItem(menuItem))
