import { CRITERIA, CriterionName, PROFILES, ProfileName } from './ontology'
import { AttributeGroup, Criterion, Crtdl, Json } from './types'

/**
 * Turns a CRTDL into one plain English sentence, so the cases we cover can be read without
 * reading `cases.ts`: `npm run crtdl:doc` renders them. Pure; it only reads the CRTDL JSON.
 */
const CRITERION_LABELS: Record<CriterionName, string> = {
  pneumonia: 'Pneumonia',
  causeOfDeath: 'Cause of death',
  age: 'Age',
  gender: 'Gender',
}

const PROFILE_LABELS: Record<ProfileName, string> = {
  patient: 'Patient',
  condition: 'Condition',
  medicationAdministration: 'Medication administration',
  medication: 'Medication',
}

const COMPARATOR_SYMBOLS: Record<string, string> = { gt: '>', lt: '<', ge: '≥', le: '≤', eq: '=', ne: '≠' }
const UNIT_LABELS: Record<string, string> = { a: 'years', mo: 'months' }

const asJson = (value: unknown) => value as Json
const unitOf = (filter: Json) => UNIT_LABELS[asJson(filter.unit).code as string] ?? (asJson(filter.unit).code as string)
const codes = (concepts: unknown) => (concepts as Json[]).map((concept) => concept.code).join(', ')

function describeTime(restriction: Json): string {
  const { afterDate, beforeDate } = restriction
  if (afterDate && afterDate === beforeDate) return `on ${afterDate}`
  if (afterDate && beforeDate) return `between ${afterDate} and ${beforeDate}`
  return afterDate ? `after ${afterDate}` : `before ${beforeDate}`
}

function describeValue(filter: Json): string {
  switch (filter.type) {
    case 'quantity-comparator':
      return `${COMPARATOR_SYMBOLS[filter.comparator as string] ?? filter.comparator} ${filter.value} ${unitOf(filter)}`
    case 'quantity-range':
      return `between ${filter.minValue} and ${filter.maxValue} ${unitOf(filter)}`
    default:
      return `is ${codes(filter.selectedConcepts)}`
  }
}

function describeCriterion(criterion: Criterion): string {
  const code = criterion.termCodes[0].code
  const name = (Object.keys(CRITERIA) as CriterionName[]).find((key) => CRITERIA[key].code === code)
  const parts = [name ? CRITERION_LABELS[name] : String(criterion.termCodes[0].display)]
  if (criterion.valueFilter) parts.push(describeValue(criterion.valueFilter))
  for (const filter of criterion.attributeFilters ?? []) {
    parts.push(`with ${asJson(filter.attributeCode).display} ${codes(filter.selectedConcepts)}`)
  }
  if (criterion.timeRestriction) parts.push(describeTime(criterion.timeRestriction))
  return parts.join(' ')
}

/** Criteria in one group are alternatives; the groups must all apply. */
const describeCriteria = (groups: Criterion[][]) => groups.map((group) => group.map(describeCriterion).join(' or ')).join(', and ')

const profileLabel = (group: AttributeGroup) => {
  const profile = (Object.keys(PROFILES) as ProfileName[]).find((key) => PROFILES[key].groupReference === group.groupReference)
  return profile ? PROFILE_LABELS[profile] : group.name
}

function describeFilter(filter: Json): string {
  if (filter.type === 'token') return `${filter.name} ${codes(filter.codes)}`
  return `${filter.name} ${describeTime({ afterDate: filter.start, beforeDate: filter.end })}`
}

function describeGroup(group: AttributeGroup, all: AttributeGroup[]): string {
  const fields = group.attributes.map((attribute) => {
    const name = attribute.attributeRef.split('.').slice(1).join('.').replace('[x]', '')
    const linked = (attribute.linkedGroups ?? []).map((id) => all.find((other) => other.id === id)).filter(Boolean)
    return `${name}${attribute.mustHave ? ' (required)' : ''}${linked.length ? ` linked to ${linked.map((other) => profileLabel(other as AttributeGroup)).join(', ')}` : ''}`
  })
  const extras = [
    ...(group.includeReferenceOnly ? ['only when referenced'] : []),
    ...(group.filter ?? []).map((filter) => `filtered by ${describeFilter(filter)}`),
  ]
  return `${profileLabel(group)} (${[...fields, ...extras].join(', ')})`
}

export function describe(crtdl: Crtdl): string {
  const { inclusionCriteria, exclusionCriteria } = crtdl.cohortDefinition
  const groups = crtdl.dataExtraction.attributeGroups
  const extra = groups.filter((group) => group.groupReference !== PROFILES.patient.groupReference)
  const sentences = [`Includes ${describeCriteria(inclusionCriteria)}.`]
  if (exclusionCriteria) sentences.push(`Excludes ${describeCriteria(exclusionCriteria)}.`)
  sentences.push(extra.length ? `Selects ${extra.map((group) => describeGroup(group, groups)).join('; ')}.` : 'Selects only the Patient data.')
  return sentences.join(' ')
}
