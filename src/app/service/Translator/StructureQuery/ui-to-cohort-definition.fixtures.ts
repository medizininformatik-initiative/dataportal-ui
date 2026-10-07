import { TestBed } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionBuilder } from 'src/app/model/FeasibilityQuery/Criterion/CriterionBuilder'
import { CriterionProviderService } from '../../Provider/CriterionProvider.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { ReferenceCriterionProviderService } from '../../Provider/ReferenceCriterionProvider.service'
import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { UIQuery2CohortDefinitionService } from './UIQuery2CohortDefinition.service'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'

/**
 * Building blocks for `ui-to-cohort-definition.cases.ts`: the UI model on one side, the expected wire
 * JSON on the other. Nothing here asserts anything.
 */

export type Json = Record<string, unknown>

// --- Values ---------------------------------------------------------------------------------

export const SNOMED = 'http://snomed.info/sct'
export const VERSION = 'http://to_be_decided.com/draft-1/schema#'
export const DEFAULT_DISPLAY = 'Ausgewählte Merkmale'

/**
 * `display` differs from `code` everywhere, so a translator that swaps or reuses one for the other is
 * caught.
 */
const displayOf = (value: string) => `${value} (display)`

/** A term code as the UI holds it, and as it looks on the wire. */
export const code = (value: string, system = SNOMED) =>
  new TerminologyCode(value, displayOf(value), system)
export const wire = (value: string, system = SNOMED): Json => ({
  code: value,
  display: displayOf(value),
  system,
})
export const wireOf = (termCode: TerminologyCode): Json => ({
  code: termCode.getCode(),
  display: termCode.getDisplay(),
  system: termCode.getSystem(),
})

const CONTEXT = new TerminologyCode('Diagnose', displayOf('Diagnose'), 'fdpg.mii.cds', '1.0.0')
export const CONTEXT_WIRE: Json = {
  code: 'Diagnose',
  display: displayOf('Diagnose'),
  system: 'fdpg.mii.cds',
  version: '1.0.0',
}

export const PNEUMONIA = new TerminologyCode('233604007', 'Pneumonia', SNOMED)
export const YEARS = new QuantityUnit('a', 'years')
export const YEARS_WIRE: Json = { code: 'a', display: 'years' }
export const MONTHS = new QuantityUnit('mo', 'months')
export const MONTHS_WIRE: Json = { code: 'mo', display: 'months' }
export const ATTRIBUTE = code('attribute', 'http://loinc.org')
export const ATTRIBUTE_WIRE = wire('attribute', 'http://loinc.org')

// --- UI model builders ----------------------------------------------------------------------

/** What a test case describes in UI terms: the query the user has built. */
export interface UiQuery {
  inclusion: Criterion[][]
  exclusion?: Criterion[][]
  /** Omitted: empty. `null`: leave the default of a new query. */
  display?: string | null
}

/** The simplest queries: one group of alternatives, or several groups. */
export const included = (...criteria: Criterion[]): UiQuery => ({ inclusion: [criteria] })

let counter = 0

/** A pneumonia criterion, registered with the provider that the translator reads from. */
export function criterion(
  options: {
    termCodes?: TerminologyCode[]
    timeRestriction?: AbstractTimeRestriction
    valueFilters?: ValueFilter[]
    attributeFilters?: AttributeFilter[]
  } = {}
): Criterion {
  const id = `criterion-${++counter}`
  const builder = new CriterionBuilder({
    isReference: false,
    context: CONTEXT,
    criterionHash: id,
    display: new Display([], 'Pneumonia'),
    isRequiredFilterSet: false,
    id,
    termCodes: options.termCodes ?? [PNEUMONIA],
  })
  if (options.timeRestriction) {
    builder.withTimeRestriction(options.timeRestriction)
  }
  if (options.valueFilters) {
    builder.withValueFilters(options.valueFilters)
  }
  if (options.attributeFilters) {
    builder.withAttributeFilters(options.attributeFilters)
  }
  const built = builder.buildCriterion()
  TestBed.inject(CriterionProviderService).setOne(built)
  return built
}

/** A criterion that another criterion points at through a reference filter. */
export function referenceCriterion(timeRestriction?: AbstractTimeRestriction) {
  const id = `reference-${++counter}`
  const builder = new CriterionBuilder({
    isReference: true,
    context: CONTEXT,
    criterionHash: id,
    display: new Display([], 'Referenced'),
    isRequiredFilterSet: false,
    id,
    termCodes: [code('referenced')],
  })
  if (timeRestriction) {
    builder.withTimeRestriction(timeRestriction)
  }
  const built = builder.buildReferenceCriterion()
  TestBed.inject(ReferenceCriterionProviderService).setOne(built)
  return built
}

export const comparator = (option: QuantityComparisonOption, value: number, unit = YEARS) =>
  new QuantityComparatorFilter(unit, [YEARS, MONTHS], 0, option, value)
export const range = (min: number, max: number) =>
  new QuantityRangeFilter(YEARS, [YEARS], 0, min, max)
export const concept = (...codes: TerminologyCode[]) =>
  new ConceptFilter(
    'concept-filter',
    [],
    codes.map((c) => new Concept(new Display([], c.getDisplay()), c))
  )

/** A filter on the criterion's own value, e.g. the age. */
export const valueFilter = (
  type: FilterTypes,
  parts: { concept?: ConceptFilter; quantity?: QuantityComparatorFilter | QuantityRangeFilter }
) => new ValueFilter(new Display([], 'value'), type, parts.concept, parts.quantity)

/** A filter on one attribute of the resource, e.g. the cause of death. */
export const attributeFilter = (
  type: FilterTypes,
  parts: {
    concept?: ConceptFilter
    quantity?: QuantityComparatorFilter | QuantityRangeFilter
    reference?: ReferenceFilter
  }
) =>
  new AttributeFilter(
    new Display([], 'attribute'),
    type,
    ATTRIBUTE,
    parts.concept,
    parts.quantity,
    parts.reference
  )

export const referenceTo = (referenced: Criterion) =>
  new ReferenceFilter('reference-filter', [], [referenced.getId()])

// --- Expected wire JSON ---------------------------------------------------------------------

/** One pneumonia criterion on the wire, plus whatever the case adds to it. */
export const pneumonia = (extra: Json = {}): Json => ({
  termCodes: [{ code: '233604007', display: 'Pneumonia', system: SNOMED }],
  context: CONTEXT_WIRE,
  ...extra,
})

/** The cohort definition on the wire; `rest` overrides or adds root properties. */
export const cohort = (inclusionCriteria: Json[][], rest: Json = {}): Json => ({
  version: VERSION,
  display: '',
  inclusionCriteria,
  ...rest,
})

// --- Running the translator -----------------------------------------------------------------

/** The query as the user holds it: built from `uiQuery` and set active in the provider. */
export function buildQuery({ inclusion, exclusion = [], display = '' }: UiQuery): FeasibilityQuery {
  const query =
    display === null ? new FeasibilityQuery('query-1') : new FeasibilityQuery('query-1', display)
  query.setInclusionCriteria(inclusion.map((group) => group.map((c) => c.getId())))
  query.setExclusionCriteria(exclusion.map((group) => group.map((c) => c.getId())))
  TestBed.inject(FeasibilityQueryProviderService).setFeasibilityQueryById(
    query,
    query.getId(),
    true
  )
  return query
}

/** The wire JSON the app would send: the translator output, serialized as on save and download. */
export async function translate(uiQuery: UiQuery): Promise<Json> {
  buildQuery(uiQuery)
  const cohortDefinition = await firstValueFrom(
    TestBed.inject(UIQuery2CohortDefinitionService).translateActiveQueryToCohortDefinition()
  )
  return JSON.parse(JSON.stringify(cohortDefinition))
}
