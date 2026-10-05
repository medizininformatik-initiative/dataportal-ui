import de from '../../src/assets/i18n/de.json'
import en from '../../src/assets/i18n/en.json'

/**
 * The language the suite runs in, set via the `language` expose value
 * (cypress.config.ts default 'en'; override with `--expose language=de`).
 *
 * UI labels are resolved from the app's own translation files, never retyped, so
 * a renamed label cannot drift from the test. `t('EDITOR.CONTENT.TAB_LABEL.SINGLE_SEARCH')`
 * returns "Single search" or "Einzelsuche"; `{{count}}`-style params are interpolated.
 */
export type Language = 'en' | 'de'

const TRANSLATIONS: Record<Language, unknown> = { en, de }

export function currentLanguage(): Language {
  return Cypress.expose('language') === 'de' ? 'de' : 'en'
}

export function t(key: string, params: Record<string, string | number> = {}): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      TRANSLATIONS[currentLanguage()]
    )
  if (typeof value !== 'string') {
    throw new Error(`No ${currentLanguage()} translation for key "${key}"`)
  }
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => String(params[name] ?? ''))
}
