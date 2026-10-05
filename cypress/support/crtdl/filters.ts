import { Json } from './types'

/**
 * Constructors for every filter shape in a CRTDL. They take the values and know nothing about
 * the ontology, so a filter is reusable with any criterion or feature that offers it.
 */
export const timeRestriction = {
  before: (date: string): Json => ({ beforeDate: date }),
  after: (date: string): Json => ({ afterDate: date }),
  between: (after: string, before: string): Json => ({ afterDate: after, beforeDate: before }),
  /** One day: the editor's "at". */
  at: (date: string): Json => ({ afterDate: date, beforeDate: date }),
}

interface Coded {
  code: string
  system: string
  display: string
}

/** Concept filter on a criterion's attribute. */
export const conceptAttribute = (attributeCode: Coded, concepts: readonly Coded[]): Json => ({
  type: 'concept',
  attributeCode,
  selectedConcepts: concepts,
})

/** Concept filter on a criterion's value. */
export const conceptValue = (concepts: readonly Coded[]): Json => ({ type: 'concept', selectedConcepts: concepts })

interface Unit {
  code: string
  display: string
}

export const quantityComparator = (comparator: string, value: number, unit: Unit): Json => ({
  type: 'quantity-comparator',
  comparator,
  value,
  unit,
})

export const quantityRange = (minValue: number, maxValue: number, unit: Unit): Json => ({
  type: 'quantity-range',
  minValue,
  maxValue,
  unit,
})

/** Filters of a feature (data extraction). */
export const dateFilter = (name: string, start?: string, end?: string): Json => ({
  type: 'date',
  name,
  ...(start ? { start } : {}),
  ...(end ? { end } : {}),
})

export const tokenFilter = (name: string, system: string, codes: ReadonlyArray<{ code: string; display: string }>): Json => ({
  type: 'token',
  name,
  codes: codes.map(({ code, display }) => ({ code, system, display })),
})
