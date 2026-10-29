import { CCDLUnit } from 'src/app/model/CohortDefinition/CCDLFilters'
import { CCDLNonEmptyArrayProperty, CCDLNumberProperty } from 'src/app/model/CohortDefinition/CCDLProperties'
import { CCDLTermCode } from 'src/app/model/CohortDefinition/CCDLTermCode'
import { CCDLTimeRestriction } from 'src/app/model/CohortDefinition/CCDLTimeRestriction'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { isNonEmpty, NonEmptyArray } from 'src/app/shared/types/NonEmptyArray'

/**
 * Maps a terminology code to its CCDL term code.
 * @param {TerminologyCode} terminologyCode
 * @returns {CCDLTermCode}
 */
export const mapTermCode = (terminologyCode: TerminologyCode): CCDLTermCode => {
  const code = terminologyCode.getCode()
  const display = terminologyCode.getDisplay()
  const system = terminologyCode.getSystem()
  const version = terminologyCode.getVersion()
  return { code, display, system, ...(version != null && { version }) }
}

/**
 * Maps a quantity unit to its CCDL unit.
 * @param {QuantityUnit} quantityUnit
 * @returns {CCDLUnit}
 */
export const mapUnit = (quantityUnit: QuantityUnit): CCDLUnit => {
  const code = quantityUnit.getCode()
  const display = quantityUnit.getDisplay()
  return { code, display }
}

/**
 * Returns the items as a non-empty array or throws if there are none.
 * @param {T[]} items
 * @param {CCDLNonEmptyArrayProperty} what
 * @returns {NonEmptyArray<T>}
 */
export const requireNonEmpty = <T>(items: T[], what: CCDLNonEmptyArrayProperty): NonEmptyArray<T> => {
  if (!isNonEmpty(items)) {
    throw new Error(`Expected at least one entry in ${what}`)
  }
  return items
}

/**
 * Returns the number or throws if the filter was left empty.
 * @param {number | null} value
 * @param {CCDLNumberProperty} what
 * @returns {number}
 */
export const requireNumber = (value: number | null, what: CCDLNumberProperty): number => {
  if (value === null) {
    throw new Error(`Expected ${what} to be set`)
  }
  return value
}

/**
 * Cuts a date down to its `YYYY-MM-DD` day.
 * @param {Date} date
 * @returns {string}
 */
const toDay = (date: Date): string => date.toISOString().split('T')[0]

/**
 * Maps a UI time restriction to its CCDL time restriction. The UI "at" restriction becomes the same
 * day twice. A restriction without a date, or of type NONE, has no CCDL counterpart.
 * @param {AbstractTimeRestriction | undefined} timeRestriction
 * @returns {CCDLTimeRestriction | undefined}
 */
export const mapTimeRestriction = (timeRestriction: AbstractTimeRestriction | undefined): CCDLTimeRestriction | undefined => {
  const afterDate = timeRestriction?.getAfterDate()
  if (!timeRestriction || !afterDate) {
    return undefined
  }
  const start = new Date(afterDate)
  const end = new Date(timeRestriction.getBeforeDate() ?? afterDate)
  const offset = start.getTimezoneOffset() / -60
  start.setHours(23 + offset, 59, 59, 999)
  end.setHours(offset, 0, 0, 0)
  const startDay = toDay(start)
  const endDay = toDay(end)
  switch (timeRestriction.getType()) {
    case TimeRestrictionType.AFTER:
      return { afterDate: startDay }
    case TimeRestrictionType.AT:
      return { afterDate: startDay, beforeDate: startDay }
    case TimeRestrictionType.BEFORE:
      return { beforeDate: startDay }
    case TimeRestrictionType.BETWEEN:
      return { afterDate: startDay, beforeDate: endDay }
    default:
      return undefined
  }
}
