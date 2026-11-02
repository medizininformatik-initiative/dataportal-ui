import { Injectable, inject } from '@angular/core'
import { combineLatest, map, Observable, of } from 'rxjs'
import { CCDLCohortDefinition } from 'src/app/model/CohortDefinition/CCDLCohortDefinition'
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL'
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ActiveDataSelectionService } from '../../Provider/ActiveDataSelection.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { ToCohortDefinitionService } from '../StructureQuery/ToCohortDefinition.service'
import { DataSelection2DataExtraction } from './DataSelection2DataExtraction.service'

@Injectable({
  providedIn: 'root',
})
export class CreateCRTDLService {
  private readonly dataExtractionTranslator = inject(DataSelection2DataExtraction)
  private readonly feasibilityQueryProvider = inject(FeasibilityQueryProviderService)
  private readonly uiQueryTranslator = inject(ToCohortDefinitionService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly activeDataSelectionService = inject(ActiveDataSelectionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates a CRTDL from the active query and data selection.
   * @returns {Observable<CRTDL>}
   */
  public createCRTDLForSave(): Observable<CRTDL> {
    return combineLatest([this.uiQueryTranslator.getActive(), this.getDataExtraction()]).pipe(
      map(([cohortDefinition, dataExtraction]) => this.buildCRTDL(cohortDefinition, dataExtraction))
    )
  }

  /**
   * Creates a CRTDL from the active query and data selection.
   * @returns {Observable<CRTDL>}
   */
  public createCRTDL(): Observable<CRTDL> {
    return this.createCRTDLForSave()
  }

  /**
   * Builds a CRTDL from the cohort definition and the data extraction.
   * @param {CCDLCohortDefinition} cohortDefinition
   * @param {DataExtraction} dataExtraction
   * @returns {CRTDL}
   */
  public buildCRTDL(cohortDefinition: CCDLCohortDefinition, dataExtraction: DataExtraction): CRTDL {
    return new CRTDL(cohortDefinition, dataExtraction)
  }

  /**
   * Translates the active data selection to a data extraction.
   * @returns {Observable<DataExtraction>}
   */
  private getDataExtraction(): Observable<DataExtraction> {
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
    return this.dataSelectionProvider
      .getDataSelection(dataSelectionId)
      .pipe(map((dataSelection) => this.dataExtractionTranslator.translateToDataExtraction(dataSelection)))
  }
}
