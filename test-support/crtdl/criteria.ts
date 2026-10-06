import { CRITERIA, context, CriterionName } from './ontology'
import { Criterion, CriterionModifier, Json } from './types'

/** A criterion by name, then modifiers applied in order: `criterion('age', withValue(...))`. */
export function criterion(name: CriterionName, ...modifiers: CriterionModifier[]): Criterion {
  const { system, code, display, context: contextCode } = CRITERIA[name]
  const base: Criterion = { termCodes: [{ code, system, display }], context: context(contextCode) }
  return modifiers.reduce((current, modify) => modify(current), base)
}

export const atTime =
  (restriction: Json): CriterionModifier =>
  (c) => ({ ...c, timeRestriction: restriction })

export const withAttribute =
  (filter: Json): CriterionModifier =>
  (c) => ({ ...c, attributeFilters: [...(c.attributeFilters ?? []), filter] })

export const withValue =
  (filter: Json): CriterionModifier =>
  (c) => ({ ...c, valueFilter: filter })
