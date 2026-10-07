export type CohortTranslationErrorCode = 'NO_INCLUSION_CRITERIA' | 'INVALID_CRITERIA'

/** Thrown when the active UI query cannot be translated; `code` is the key under `ERROR` in i18n. */
export class CohortTranslationError extends Error {
  constructor(readonly code: CohortTranslationErrorCode, readonly criterionIds: string[] = []) {
    super(code)
  }
}
