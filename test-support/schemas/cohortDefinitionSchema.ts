/**
 * Validates a cohortDefinition against the CCDL v1.0.0 JSON Schema (the only schema version we
 * support): https://github.com/medizininformatik-initiative/clinical-cohort-definition-language
 *
 * Formats are asserted on purpose: in draft 2020-12 `format` is annotation-only by default, so
 * without it `"date"` and `"uri"` would never fail.
 */
import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import { readFileSync } from 'fs'
import { join } from 'path'

const schema = JSON.parse(readFileSync(join(__dirname, 'ccdl-v1.0.0.schema.json'), 'utf8'))
const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)
const validate = ajv.compile(schema)

/** Returns one readable line per violation; an empty list means the document is valid CCDL v1. */
export function cohortDefinitionErrors(cohortDefinition: unknown): string[] {
  console.log(JSON.stringify(cohortDefinition, null, 2))
  validate(cohortDefinition)
  return (validate.errors ?? []).map((error) => `${error.instancePath || '$'} ${error.message}`)
}
