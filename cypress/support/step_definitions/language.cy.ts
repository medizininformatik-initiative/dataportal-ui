import { defineStep } from '../defineStep'
import { currentLanguage } from '../i18n'

// {word}, not literal English/German: Cucumber matches the pattern before `{{placeholders}}` are resolved.
const LANGUAGES: Record<string, 'en' | 'de'> = { English: 'en', German: 'de' }

export class Language {
  public setLanguageByName(name: string) {
    if (!LANGUAGES[name]) throw new Error(`Unknown language "${name}"`)
    this.setLanguage(LANGUAGES[name])
  }

  public setConfiguredLanguage() {
    // Uses the language configured for the run (`--expose language=de`, default 'en').
    this.setLanguage(currentLanguage())
  }

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

defineStep('I set the language to {word}', (language: string) =>
  languageInstance.setLanguageByName(language)
)
defineStep('I set the language to the configured language', () =>
  languageInstance.setConfiguredLanguage()
)
