import { ActiveDataSelectionService } from '../../Provider/ActiveDataSelection.service'
import { combineLatest, map, Observable, of } from 'rxjs'
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL'
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction'
import { DataSelection2DataExtraction } from './DataSelection2DataExtraction.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { CCDLCohortDefinition } from 'src/app/model/CohortDefinition/CCDLCohortDefinition'
import { ToCohortDefinitionService } from '../StructureQuery/ToCohortDefinition.service'

@Injectable({
  providedIn: 'root',
})
export class CreateCRTDLService {
  private dataExtractionTranslator = inject(DataSelection2DataExtraction)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)
  private uiQueryTranslator = inject(ToCohortDefinitionService)
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private activeDataSelectionService = inject(ActiveDataSelectionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public createCRTDLForSave(): Observable<CRTDL> {
    return combineLatest([this.uiQueryTranslator.getActive(), this.getDataExtraction()]).pipe(
      map(([cohortDefinition, dataExtraction]) => this.buildCRTDL(cohortDefinition, dataExtraction))
    )
  }

  public createCRTDL(): Observable<CRTDL> {
    return this.createCRTDLForSave()
  }

  public buildCRTDL(cohortDefinition: CCDLCohortDefinition, dataExtraction: DataExtraction): CRTDL {
    return new CRTDL(cohortDefinition, dataExtraction)
  }

  private getDataExtraction(): Observable<DataExtraction> {
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
    return this.dataSelectionProvider
      .getDataSelection(dataSelectionId)
      .pipe(map((dataSelection) => this.dataExtractionTranslator.translateToDataExtraction(dataSelection)))
  }
}
