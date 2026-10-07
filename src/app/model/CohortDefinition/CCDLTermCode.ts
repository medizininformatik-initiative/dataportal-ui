/**
 * Types for the CCDL v1 `cohortDefinition`, the part of a CRTDL that the app produces.
 *
 * The types are written by hand and mirror the JSON Schema of the Clinical Cohort Definition Language
 * (tag v1.0.0), vendored at `test-support/schemas/ccdl-v1.0.0.schema.json`. The Jest spec
 * `cohort-definition.types.spec.ts` keeps them in line with that schema.
 *
 * Every type is prefixed `CCDL` so it cannot be confused with the UI model class of the same concept
 * (`TerminologyCode`, `QuantityUnit`, `TimeRestriction`, ...).
 *
 * @see https://github.com/medizininformatik-initiative/clinical-cohort-definition-language
 */

/**
 * An array with at least one element, as required by `minItems: 1` in the schema.
 * Empty arrays are not allowed. .map() returns a normal array,
 * so you need a cast or helper to use the result as a NonEmptyArray.
 *
 * @template T - The type of the elements.
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * A concept from a coding system. The triplet of code, system and version identifies the concept.
 *
 * @see `$defs/termCode` in the CCDL v1 schema.
 */
export interface CCDLTermCode {
  /**
   * The code within the coding system (e.g. `233604007` in SNOMED CT).
   *
   */
  code: string

  /**
   * URI of the coding system (e.g. `http://snomed.info/sct`).
   */
  system: string

  /**
   * Human-readable text for the code.
   */
  display: string

  /**
   * Version of the coding system. The only optional property of a term code.
   */
  version?: string
}

export const isNonEmpty = <T>(items: T[]): items is NonEmptyArray<T> => items.length > 0
