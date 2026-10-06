import { criterion } from './criteria'
import { patient } from './groups'
import { AttributeGroup, Criterion, Crtdl } from './types'

export interface CrtdlOptions {
  inclusion?: Criterion[][]
  exclusion?: Criterion[][]
  groups?: AttributeGroup[]
}

/** A complete CRTDL. The defaults are the smallest valid one: Pneumonia included, Patient selected. */
export function crtdl({ inclusion = [[criterion('pneumonia')]], exclusion, groups = [patient()] }: CrtdlOptions = {}): Crtdl {
  return {
    version: 'http://json-schema.org/to-be-done/schema#',
    display: '',
    cohortDefinition: {
      version: 'http://to_be_decided.com/draft-1/schema#',
      display: 'Ausgewählte Merkmale',
      inclusionCriteria: inclusion,
      ...(exclusion ? { exclusionCriteria: exclusion } : {}),
    },
    dataExtraction: { attributeGroups: groups },
  }
}
