import { CCDLTermCode, NonEmptyArray } from './CCDLTermCode'
import type { CCDLCriterion } from './CCDLCriterion'

/**
 * A UCUM unit of a quantity filter.
 *
 * @see `$defs/unit` in the CCDL v1 schema.
 */
export interface CCDLUnit {
  /**
   * The UCUM code (e.g. `a` for years, `mo` for months).
   */
  code: string

  /**
   * Human-readable text for the unit.
   */
  display: string
}

/**
 * The comparators the editor can produce today.
 *
 * Deliberately narrower than the schema, whose `comparator` enum is `gt | ge | lt | le | eq | ne`:
 * `ge` and `le` are not representable in the UI model yet (`QuantityComparisonOption`), and the
 * backend answers 500 to `ne`. Widen this type when the `ge`/`le` change lands (the `@pending`
 * roundtrip scenarios).
 *
 * @see `quantity-comparator` in `$defs/valueFilter` of the CCDL v1 schema.
 */
export type CCDLComparator = 'gt' | 'lt' | 'eq'

/**
 * Filter by a selection of concepts (e.g. the genders `female` or `male`). The shape is shared by
 * value filters and attribute filters; see `AsAttributeFilter`.
 *
 * @see `concept` in `$defs/valueFilter` of the CCDL v1 schema.
 */
export interface CCDLConceptFilter {
  /**
   * Discriminator of the filter union.
   */
  type: 'concept'

  /**
   * The selected concepts. At least one.
   */
  selectedConcepts: NonEmptyArray<CCDLTermCode>
}

/**
 * Filter by comparing a number with a value (e.g. age greater than 18 years). The shape is shared by
 * value filters and attribute filters; see `AsAttributeFilter`.
 *
 * @see `quantity-comparator` in `$defs/valueFilter` of the CCDL v1 schema.
 */
export interface CCDLQuantityComparatorFilter {
  /**
   * Discriminator of the filter union.
   */
  type: 'quantity-comparator'

  /**
   * How the resource's number is compared with `value`.
   */
  comparator: CCDLComparator

  /**
   * The number to compare with.
   */
  value: number

  /**
   * The unit of `value`. Optional in the schema.
   */
  unit?: CCDLUnit
}

/**
 * Filter by a closed number range (e.g. age from 18 to 65 years). The shape is shared by value
 * filters and attribute filters; see `AsAttributeFilter`.
 *
 * @see `quantity-range` in `$defs/valueFilter` of the CCDL v1 schema.
 */
export interface CCDLQuantityRangeFilter {
  /**
   * Discriminator of the filter union.
   */
  type: 'quantity-range'

  /**
   * Lower end of the range.
   */
  minValue: number

  /**
   * Upper end of the range.
   */
  maxValue: number

  /**
   * The unit of both bounds. Optional in the schema.
   */
  unit?: CCDLUnit
}

/**
 * A filter on the criterion's own value (e.g. the age of a patient). A criterion has at most one.
 * Discriminated by `type`.
 *
 * @see `$defs/valueFilter` in the CCDL v1 schema.
 */
export type CCDLValueFilter =
  | CCDLConceptFilter
  | CCDLQuantityComparatorFilter
  | CCDLQuantityRangeFilter

/**
 * Turns the shared filter shape into an attribute filter by adding the attribute it applies to. In the
 * schema an attribute filter is a value filter plus `attributeCode`.
 *
 * @template T - The shared filter shape to extend (concept, comparator or range).
 */
type AsAttributeFilter<T> = T & {
  /**
   * The attribute of the resource the filter applies to (e.g. the cause of death).
   */
  attributeCode: CCDLTermCode
}

/**
 * A concept filter on one attribute of a resource.
 *
 * @see `concept` in `$defs/attributeFilter` of the CCDL v1 schema.
 */
export type CCDLConceptAttributeFilter = AsAttributeFilter<CCDLConceptFilter>

/**
 * A comparator filter on one attribute of a resource.
 *
 * @see `quantity-comparator` in `$defs/attributeFilter` of the CCDL v1 schema.
 */
export type CCDLQuantityComparatorAttributeFilter = AsAttributeFilter<CCDLQuantityComparatorFilter>

/**
 * A range filter on one attribute of a resource.
 *
 * @see `quantity-range` in `$defs/attributeFilter` of the CCDL v1 schema.
 */
export type CCDLQuantityRangeAttributeFilter = AsAttributeFilter<CCDLQuantityRangeFilter>

/**
 * The attribute points at other criteria (e.g. a medication administration that must link to a
 * particular medication).
 *
 * @see `reference` in `$defs/attributeFilter` of the CCDL v1 schema.
 */
export interface CCDLReferenceAttributeFilter {
  /**
   * Discriminator of the filter union.
   */
  type: 'reference'

  /**
   * The attribute that holds the reference (e.g. `medication[x]`).
   */
  attributeCode: CCDLTermCode

  /**
   * The criteria the reference has to satisfy. At least one. Their own attribute filters may not be
   * references again: the schema allows one level of nesting only.
   */
  criteria: NonEmptyArray<CCDLReferencedCriterion>
}

/**
 * A filter on one attribute of a resource. Discriminated by `type`.
 *
 * @see `$defs/attributeFilter` in the CCDL v1 schema.
 */
export type CCDLAttributeFilter =
  | CCDLConceptAttributeFilter
  | CCDLQuantityComparatorAttributeFilter
  | CCDLQuantityRangeAttributeFilter
  | CCDLReferenceAttributeFilter

/**
 * A criterion inside a reference filter: an ordinary criterion whose attribute filters are not
 * references.
 *
 * @see `reference` in `$defs/attributeFilter` of the CCDL v1 schema.
 */
export type CCDLReferencedCriterion = Omit<CCDLCriterion, 'attributeFilters'> & {
  /**
   * The attribute filters of the referenced criterion, without further references.
   */
  attributeFilters?: Array<Exclude<CCDLAttributeFilter, CCDLReferenceAttributeFilter>>
}
