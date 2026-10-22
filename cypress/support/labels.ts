import { currentLanguage } from './i18n'

/**
 * Data-driven labels: criterion and filter names from ontology and ui-profile, not
 * en.json/de.json. Features use English name. `label()` returns German counterpart when suite
 * runs German, falls back to given text for anything unlisted (many names identical in both
 * languages, e.g. "ICD-10-WHO", "BIOMAT raise"). Source: `GET terminology/ui-profile`
 * display translations (see TEST_DATA.md).
 * */
const GERMAN: Record<string, string> = {
  'Type of encounter': 'Kontaktart',
  'Level of encounter': 'Kontaktebene',
  'Department key': 'Fachabteilungsschlüssel',
  'Extended department key': 'Erweiterter Fachabteilungsschlüssel',
  Gender: 'Geschlecht',
  'Terminology Codes': 'Terminologie-Codes',
}

/**
 * Return label in configured language.
 * */
export function label(englishName: string): string {
  return currentLanguage() === 'de' ? GERMAN[englishName] ?? englishName : englishName
}
