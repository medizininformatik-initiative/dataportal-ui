import { TestBed } from '@angular/core/testing'
import { EMPTY } from 'rxjs'
import { CrtdlProcessingPipelineService } from '../CrtdlProcessingPipeline.service'
import { DataSelection2DataExtraction } from '../Translator/CRTDL/DataSelection2DataExtraction.service'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { NavigationHelperService } from '../NavigationHelper.service'
import { SnackbarMessageService } from '../SnackbarMessage.service'
import { UploadService } from './Upload.service'

// A bare CCDL (cohort definition without CRTDL wrapper), as saved before CRTDL existed
const legacyCcdl = {
  display: 'Ausgewählte Merkmale',
  version: 'http://to_be_decided.com/draft-1/schema#',
  inclusionCriteria: [
    [
      {
        context: {
          code: 'Laboruntersuchung',
          display: 'Laboruntersuchung',
          system: 'fdpg.mii.cds',
          version: '1.0.0',
        },
        termCodes: [
          { code: '30525-0', display: 'Age', system: 'http://loinc.org', version: '2.81' },
        ],
      },
    ],
  ],
}

describe('UploadService', () => {
  const process = jest.fn().mockReturnValue(EMPTY)

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CrtdlProcessingPipelineService, useValue: { process } },
        { provide: SnackbarMessageService, useValue: {} },
        { provide: NavigationHelperService, useValue: {} },
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

  it('upgrades an uploaded bare CCDL to a CRTDL', () => {
    TestBed.inject(UploadService).uploadAndTranslate(legacyCcdl as any)

    const crtdl = process.mock.calls[0][0]
    expect(crtdl.content).toBeUndefined()
    expect(crtdl.cohortDefinition).toEqual(legacyCcdl)
    expect(crtdl.dataExtraction).toEqual({ attributeGroups: [] })
  })
})
