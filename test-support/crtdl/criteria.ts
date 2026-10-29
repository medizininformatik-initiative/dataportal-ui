import { CRITERIA, context, CriterionName } from './ontology'
import { Criterion, CriterionModifier, Json } from './types'

/**
 * Build criterion by name, then apply modifiers in order: `criterion('age', withValue(...))`.
 * */
export function criterion(name: CriterionName, ...modifiers: CriterionModifier[]): Criterion {
  const { system, code, display, context: contextCode } = CRITERIA[name]
  const base: Criterion = { termCodes: [{ code, system, display }], context: context(contextCode) }
  return modifiers.reduce((current, modify) => modify(current), base)
}

/**
 * Modifier setting time restriction.
 * */
export const atTime =
  (restriction: Json): CriterionModifier =>
  (c) => ({ ...c, timeRestriction: restriction })

/**
 * Modifier appending attribute filter.
 * */
export const withAttribute =
  (filter: Json): CriterionModifier =>
  (c) => ({ ...c, attributeFilters: [...(c.attributeFilters ?? []), filter] })

/**
 * Modifier setting value filter.
 * */
export const withValue =
  (filter: Json): CriterionModifier =>
  (c) => ({ ...c, valueFilter: filter })
