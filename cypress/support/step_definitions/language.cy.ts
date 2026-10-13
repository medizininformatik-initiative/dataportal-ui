import { defineStep } from '../defineStep'
import { currentLanguage } from '../i18n'

/**
 * `{word}`, not literal English/German: Cucumber matches pattern before `{{placeholders}}`
 * resolve.
 * */
const LANGUAGES: Record<string, 'en' | 'de'> = { English: 'en', German: 'de' }

/**
 * Switch app language via language select.
 * */
export class Language {
  /**
   * Switch language by English name. Throw on unknown name.
   * */
  public setLanguageByName(name: string) {
    if (!LANGUAGES[name]) throw new Error(`Unknown language "${name}"`)
    this.setLanguage(LANGUAGES[name])
  }

  /**
   * Use language configured for run.
   * */
  public setConfiguredLanguage() {
    /**
     * Language configured for run: `--expose language=de`, default `en`.
     * */
    this.setLanguage(currentLanguage())
  }

  /**
   * Open language select, pick option, wait for matching flag icon.
   * */
  public setLanguage(language: 'en' | 'de' = 'en') {
    cy.get('[data-cy="language-select"]').first().click()
    cy.get(`[data-cy="language-option-${language}"]`).click()
    /**
     * Real post-condition, no fixed wait: ngx-translate language switch can be async. Flag icon
     * renders only once `translate.currentLang` switched.
     * */
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
