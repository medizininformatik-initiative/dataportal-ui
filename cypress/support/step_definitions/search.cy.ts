import { defineStep } from '../defineStep'

const NUM_SEARCHBAR_INPUT = 'num-searchbar input'

/**
 * Steps for search bar input.
 * */
export class Search {
  /**
   * Clear search input, then type text.
   * */
  public typeInInputField(text: string) {
    cy.get(NUM_SEARCHBAR_INPUT).clear().type(text).should('have.value', text)
  }

  /**
   * Clear search input.
   * */
  public clearInputField() {
    cy.get(NUM_SEARCHBAR_INPUT).clear().should('have.value', '')
  }

  /**
   * Assert search input value.
   * */
  public inputShouldKeepText(text: string) {
    cy.get(NUM_SEARCHBAR_INPUT).should('have.value', text)
  }
}

export const searchInstance = new Search()
defineStep('I type {string} in the search input field', (text: string) =>
  searchInstance.typeInInputField(text)
)
defineStep('I clear the search input field', () => searchInstance.clearInputField())
defineStep('the search input should keep the text {string}', (text: string) =>
  searchInstance.inputShouldKeepText(text)
)
