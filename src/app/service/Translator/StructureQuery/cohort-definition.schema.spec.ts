import { describe, expect, it } from '@jest/globals'
import { cohortDefinitionErrors } from '../../../../../test-support/schemas/cohortDefinitionSchema'

describe('CCDL v1 schema', () => {
  it('accepts the cohortDefinition of a CRTDL saved by the app', () => {
    // Taken from a real CRTDL: `code` and `display` differ, and the term code carries a `version`.
    const cohortDefinition = {
      version: 'http://to_be_decided.com/draft-1/schema#',
      display: 'Ausgewählte Merkmale',
      inclusionCriteria: [
        [
          {
            termCodes: [
              {
                code: '33355-9',
                display: 'Urea nitrogen [Moles/volume] in 24 hour Urine',
                system: 'http://loinc.org',
                version: '2.81',
              },
            ],
            context: {
              code: 'Laboruntersuchung',
              display: 'Laboruntersuchung',
              system: 'fdpg.mii.cds',
              version: '1.0.0',
            },
          },
        ],
      ],
    }
    expect(cohortDefinitionErrors(cohortDefinition)).toEqual([])
  })
})
