import { currentLanguage } from './i18n'

/**
 * Data-driven labels (criterion / filter names coming from the ontology and
 * ui-profile, not from en.json/de.json). Features are written with the English
 * name; `label()` returns its German counterpart when the suite runs in German and
 * falls back to the given text for anything not listed (many names are identical in
 * both languages, e.g. "ICD-10-WHO", "BIOMAT erheben").
 *
 * Source: `GET terminology/ui-profile` display translations (see TEST_DATA.md).
 */
const GERMAN: Record<string, string> = {
  'Type of encounter': 'Kontaktart',
  'Level of encounter': 'Kontaktebene',
  'Department key': 'Fachabteilungsschlüssel',
  'Extended department key': 'Erweiterter Fachabteilungsschlüssel',
  Gender: 'Geschlecht',
}

export function label(englishName: string): string {
  return currentLanguage() === 'de' ? GERMAN[englishName] ?? englishName : englishName
}
