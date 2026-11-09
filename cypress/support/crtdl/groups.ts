import { FIELDS, PROFILES, ProfileName } from './ontology'
import { Attribute, AttributeGroup, Json } from './types'

type FieldName = keyof typeof FIELDS

/**
 * Selected field. `linksTo` makes it reference to another feature of same CRTDL. Group id
 * defaults to profile name: link needs no id spelled out.
 * */
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

/**
 * Normalise field selection to attribute.
 * */
const toAttribute = (selection: FieldName | FieldSelection): Attribute => {
  const {
    field,
    mustHave = false,
    linksTo,
  } = typeof selection === 'string' ? { field: selection } : selection
  return { attributeRef: FIELDS[field], mustHave, ...(linksTo ? { linkedGroups: [linksTo] } : {}) }
}

/**
 * One feature (attribute group) of profile. App omits false `includeReferenceOnly`: only true
 * is sent.
 * */
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

/**
 * Patient feature every data selection keeps.
 * */
export const patient = () => attributeGroup('patient', { fields: ['patientActive'] })
