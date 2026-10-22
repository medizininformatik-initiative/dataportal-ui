import { dataCy } from '../dataCy'
import { defineStep } from '../defineStep'

/**
 * Header theme toggle. Missing data-theme means light.
 * */
class Theme {
  /**
   * Click toggle.
   * */
  public toggle() {
    cy.get(dataCy('theme-toggle')).click()
  }

  /**
   * Assert current theme.
   * */
  public shouldBe(expected: string) {
    cy.get('html').should(($html) => expect($html.attr('data-theme') ?? 'light').to.eq(expected))
  }

  /**
   * Reload page.
   * */
  public reload() {
    cy.reload()
  }
}

export const themeInstance = new Theme()

defineStep('I toggle the theme', () => themeInstance.toggle())
defineStep('the theme should be {word}', (name: string) => themeInstance.shouldBe(name))
defineStep('I reload the page', () => themeInstance.reload())
