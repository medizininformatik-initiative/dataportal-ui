import { FIELDS, PROFILES, ProfileName } from './ontology'
import { Attribute, AttributeGroup, Json } from './types'

type FieldName = keyof typeof FIELDS

/**
 * A selected field. `linksTo` makes it a reference to another feature of the same CRTDL; a
 * group's id defaults to its profile name, so the link needs no id spelled out.
 */
export interface FieldSelection {
  field: FieldName
  mustHave?: boolean
  linksTo?: ProfileName
}

export interface GroupOptions {
  id?: string
  fields?: Array<FieldName | FieldSelection>
  referenceOnly?: boolean
  filters?: Json[]
}

const toAttribute = (selection: FieldName | FieldSelection): Attribute => {
  const { field, mustHave = false, linksTo } = typeof selection === 'string' ? { field: selection } : selection
  return { attributeRef: FIELDS[field], mustHave, ...(linksTo ? { linkedGroups: [linksTo] } : {}) }
}

/** One feature (attribute group) of a profile. The app omits a false `includeReferenceOnly`, so only true is sent. */
export function attributeGroup(
  profile: ProfileName,
  { id = profile, fields = [], referenceOnly, filters }: GroupOptions = {}
): AttributeGroup {
  return {
    id,
    ...PROFILES[profile],
    attributes: fields.map(toAttribute),
    ...(referenceOnly ? { includeReferenceOnly: true as const } : {}),
    ...(filters ? { filter: filters } : {}),
  }
}

/** The Patient feature that every data selection keeps. */
export const patient = () => attributeGroup('patient', { fields: ['patientActive'] })
