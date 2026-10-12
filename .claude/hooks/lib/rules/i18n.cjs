const { readFileSync } = require('node:fs')
const path = require('node:path')
const { ROOT } = require('../paths.cjs')

const I18N_DIR = 'src/assets/i18n'

const flatten = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) =>
    value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  )

const loadKeys = (lang) => new Set(flatten(JSON.parse(readFileSync(path.join(ROOT, I18N_DIR, `${lang}.json`), 'utf8'))))

/** Static translation keys on added html/ts lines must exist in de.json and en.json. Dynamic keys are only counted. */
const checkReferences = ({ relPath, type, addedLines }) => {
  if (type !== 'html' && type !== 'ts') {
    return []
  }
  let de, en
  try {
    de = loadKeys('de')
    en = loadKeys('en')
  } catch {
    return [] // broken json is reported by the i18n parity check
  }
  const warnings = []
  let dynamic = 0
  for (const { lineNumber, text } of addedLines) {
    const staticKeys = [
      ...text.matchAll(/(['"`])([^'"`$|]+)\1\s*\|\s*translate\b/g),
      ...text.matchAll(/\b(?:instant|translate\w*\.(?:get|stream))\(\s*(['"`])([^'"`$]+)\1/g),
    ].map((m) => m[2])
    for (const key of staticKeys) {
      for (const [lang, keys] of [['de', de], ['en', en]]) {
        if (!keys.has(key)) {
          warnings.push(`${relPath}:${lineNumber} translation key '${key}' missing in ${lang}`)
        }
      }
    }
    if (/\b(?:instant|translate\w*\.(?:get|stream))\(\s*(?!['"`][^'"`$]*['"`]\s*[,)])/.test(text) || /`[^`]*\$\{[^`]*\}[^`]*`\s*\|\s*translate/.test(text)) {
      dynamic++
    }
  }
  return dynamic ? [...warnings, `${relPath}: ${dynamic} dynamic refs not checked`] : warnings
}

/** de.json vs en.json key sets, minus the known baseline. */
const checkParity = ({ relPath, type }) => {
  if (type !== 'i18n') {
    return []
  }
  let de, en
  try {
    de = loadKeys('de')
    en = loadKeys('en')
  } catch (e) {
    return [`${relPath}: invalid JSON (${e.message})`]
  }
  let baseline = { missingInDe: [], missingInEn: [] }
  try {
    baseline = JSON.parse(readFileSync(path.join(__dirname, '..', '..', 'i18n-baseline.json'), 'utf8'))
  } catch {
    // no baseline file: report everything
  }
  const missingInDe = [...en].filter((k) => !de.has(k))
  const missingInEn = [...de].filter((k) => !en.has(k))
  return [
    ...missingInDe.filter((k) => !baseline.missingInDe.includes(k)).map((k) => `i18n: '${k}' missing in de`),
    ...missingInEn.filter((k) => !baseline.missingInEn.includes(k)).map((k) => `i18n: '${k}' missing in en`),
    ...baseline.missingInDe.filter((k) => !missingInDe.includes(k)).map((k) => `i18n: '${k}' now in de, remove from baseline`),
    ...baseline.missingInEn.filter((k) => !missingInEn.includes(k)).map((k) => `i18n: '${k}' now in en, remove from baseline`),
  ]
}

module.exports = { checkReferences, checkParity, flatten }
