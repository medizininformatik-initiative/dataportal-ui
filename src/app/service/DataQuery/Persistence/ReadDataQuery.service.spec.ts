import { TestBed } from '@angular/core/testing'
import { EMPTY, of } from 'rxjs'
import { CrtdlProcessingPipelineService } from '../../CrtdlProcessingPipeline.service'
import { CRTDLValidationService } from '../../Validation/External/CRTDLValidation.service'
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service'
import { DataSelection2DataExtraction } from '../../Translator/CRTDL/DataSelection2DataExtraction.service'
import { DataSelectionMainProfileProviderService } from '../../DataSelectionMainProfileProvider.service'
import { ReadDataQueryService } from './ReadDataQuery.service'

// Content of a query saved before CRTDL existed: a bare StructuredQuery
const legacyStructuredQuery = {
  version: 'http://to_be_decided.com/draft-1/schema#',
  inclusionCriteria: [
    [
      {
        context: {
          code: 'Laboruntersuchung',
          system: 'fdpg.mii.cds',
          version: '1.0.0',
          display: 'Laboruntersuchung',
        },
        termCodes: [
          { code: '6977-3', system: 'http://loinc.org', version: '2.81', display: 'Amoxicillin' },
        ],
      },
    ],
  ],
}

describe('ReadDataQueryService', () => {
  const process = jest.fn().mockReturnValue(EMPTY)

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DataQueryApiService,
          useValue: { getDataQueryById: () => of({ id: 1, content: legacyStructuredQuery }) },
        },
        { provide: CrtdlProcessingPipelineService, useValue: { process } },
        { provide: CRTDLValidationService, useValue: {} },
        {
          provide: DataSelection2DataExtraction,
          useValue: { translateToDataExtraction: () => ({ attributeGroups: [] }) },
        },
        {
          provide: DataSelectionMainProfileProviderService,
          useValue: { getPatientProfileValue: () => ({}) },
        },
      ],
    })
  })

  it('upgrades a legacy StructuredQuery to a CRTDL without wrapping it in another content object', () => {
    TestBed.inject(ReadDataQueryService).readDataQueryById(1).subscribe()

    const crtdl = process.mock.calls[0][0]
    expect(crtdl.content).toBeUndefined()
    expect(crtdl.cohortDefinition).toEqual(legacyStructuredQuery)
    expect(crtdl.dataExtraction).toEqual({ attributeGroups: [] })
  })
})
