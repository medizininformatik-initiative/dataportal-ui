import { ActiveDataSelectionService } from '../../Provider/ActiveDataSelection.service'
import { combineLatest, map, Observable, of } from 'rxjs'
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL'
import { DataExtraction } from 'src/app/model/CRTDL/DataExtraction/DataExtraction'
import { DataSelection2DataExtraction } from './DataSelection2DataExtraction.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryProviderService } from '../../Provider/FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { StructuredQuery } from 'src/app/model/StructuredQuery/StructuredQuery'
import { UIQuery2StructuredQueryService } from '../StructureQuery/UIQuery2StructuredQuery.service'

@Injectable({
  providedIn: 'root',
})
export class CreateCRTDLService {
  private dataExtractionTranslator = inject(DataSelection2DataExtraction)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)
  private uiQueryTranslator = inject(UIQuery2StructuredQueryService)
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private activeDataSelectionService = inject(ActiveDataSelectionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public createCRTDLForSave(): Observable<CRTDL> {
    const structuredQuery$ = this.getStructuredQuery()
    const dataExtraction$ = this.getDataExtraction()

    return combineLatest([structuredQuery$, dataExtraction$]).pipe(
      map(([structuredQuery, dataExtraction]) => this.buildCRTDL(structuredQuery, dataExtraction))
    )
  }

  public createCRTDL(): Observable<CRTDL> {
    return combineLatest([this.getStructuredQuery(), this.getDataExtraction()]).pipe(
      map(([structuredQuery, dataExtraction]) => {
        if (structuredQuery.getInclusionCriteria()?.length > 0) {
          return this.buildCRTDL(structuredQuery, dataExtraction)
        }
      })
    )
  }

  public buildCRTDL(structuredQuery: StructuredQuery, dataExtraction: DataExtraction): CRTDL {
    return new CRTDL(structuredQuery, dataExtraction)
  }

  private getStructuredQuery(): Observable<StructuredQuery> {
    return this.feasibilityQueryProvider
      .getActiveFeasibilityQuery()
      .pipe(
        map((feasibilityQuery) =>
          this.uiQueryTranslator.translateToStructuredQuery(feasibilityQuery)
        )
      )
  }

  private getDataExtraction(): Observable<DataExtraction> {
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
    return this.dataSelectionProvider
      .getDataSelection(dataSelectionId)
      .pipe(
        map((dataSelection) =>
          this.dataExtractionTranslator.translateToDataExtraction(dataSelection)
        )
      )
  }
}
