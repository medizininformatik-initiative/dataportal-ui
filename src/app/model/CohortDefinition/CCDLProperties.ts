import { KeysOfType } from 'src/app/shared/types/KeysOfType'
import { NonEmptyArray } from 'src/app/shared/types/NonEmptyArray'
import { CCDLCriterion } from './CCDLCriterion'
import { CCDLConceptFilter, CCDLQuantityComparatorFilter, CCDLQuantityRangeFilter, CCDLReferenceAttributeFilter } from './CCDLFilters'

/**
 * The CCDL properties that must hold at least one element: `termCodes`, `selectedConcepts` and
 * `criteria`. Derived from the CCDL types, so it follows them when they change.
 */
export type CCDLNonEmptyArrayProperty =
  | KeysOfType<CCDLCriterion, NonEmptyArray<unknown>>
  | KeysOfType<CCDLConceptFilter, NonEmptyArray<unknown>>
  | KeysOfType<CCDLReferenceAttributeFilter, NonEmptyArray<unknown>>

/**
 * The CCDL properties that hold a number: `value`, `minValue` and `maxValue`. Derived from the CCDL
 * types, so it follows them when they change.
 */
export type CCDLNumberProperty = KeysOfType<CCDLQuantityComparatorFilter, number> | KeysOfType<CCDLQuantityRangeFilter, number>
