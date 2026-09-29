import { defineStep } from '@badeball/cypress-cucumber-preprocessor'

export class Language {
  public setLanguage(language: 'en' | 'de' = 'en') {
    cy.get('[data-cy="language-select"]').first().click()
    cy.get(`[data-cy="language-option-${language}"]`).click()
    // Real post-condition instead of a fixed wait: ngx-translate resolving a
    // language switch can be async, so wait for the flag icon that only
    // renders once translate.currentLang has actually switched.
    const flagClass = language === 'de' ? '.fi-de' : '.fi-gb'
    cy.get(flagClass).should('exist')
  }
}

export const languageInstance = new Language()

defineStep('I set the language to English', () => {
  languageInstance.setLanguage('en')
})
defineStep('I set the language to German', () => {
  languageInstance.setLanguage('de')
})
