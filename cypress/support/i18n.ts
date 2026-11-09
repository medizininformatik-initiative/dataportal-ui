import de from '../../src/assets/i18n/de.json'
import en from '../../src/assets/i18n/en.json'

/**
 * Language suite runs in, set via `language` expose value (`cypress.config.ts` default `en`,
 * override `--expose language=de`). UI labels resolve from app own translation files, never
 * retyped: renamed label cannot drift from test. `t('EDITOR.CONTENT.TAB_LABEL.SINGLE_SEARCH')`
 * returns "Single search" or "Einzelsuche". `{{count}}`-style params interpolate.
 * */
export type Language = 'en' | 'de'

const TRANSLATIONS: Record<Language, unknown> = { en, de }

/**
 * Return configured suite language.
 * */
export function currentLanguage(): Language {
  return Cypress.expose('language') === 'de' ? 'de' : 'en'
}

/**
 * Translate key in configured language, interpolating params.
 * */
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
