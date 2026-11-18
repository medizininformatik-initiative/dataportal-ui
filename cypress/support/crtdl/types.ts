/**
 * Slice of CRTDL JSON built by roundtrip tests. Mirrors `src/app/model/Interface`.
 * */
export type Json = Record<string, unknown>

export interface Criterion {
  termCodes: Json[]
  context: Json
  timeRestriction?: Json
  attributeFilters?: Json[]
  valueFilter?: Json
}

/**
 * Change to criterion. Criteria compose by applying modifiers in order.
 * */
export type CriterionModifier = (criterion: Criterion) => Criterion

export interface Attribute {
  attributeRef: string
  mustHave: boolean
  linkedGroups?: string[]
}

export interface AttributeGroup {
  id: string
  groupReference: string
  name: string
  attributes: Attribute[]
  includeReferenceOnly?: true
  filter?: Json[]
}

export interface Crtdl {
  version: string
  display: string
  cohortDefinition: {
    version: string
    display: string
    inclusionCriteria: Criterion[][]
    exclusionCriteria?: Criterion[][]
  }
  dataExtraction: { attributeGroups: AttributeGroup[] }
}
