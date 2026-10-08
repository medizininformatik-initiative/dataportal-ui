export type CohortTranslationErrorCode = 'NO_INCLUSION_CRITERIA' | 'INVALID_CRITERIA'

/** Thrown when the active UI query cannot be translated; `code` is the key under `ERROR` in i18n. */
export class CohortTranslationError extends Error {
  /**
   * Creates the error for a query that cannot be translated, with the offending criterion ids.
   * @param {CohortTranslationErrorCode} code
   * @param {string[]} criterionIds
   */
  constructor(public readonly code: CohortTranslationErrorCode, public readonly criterionIds: string[] = []) {
    super(code)
  }
}
