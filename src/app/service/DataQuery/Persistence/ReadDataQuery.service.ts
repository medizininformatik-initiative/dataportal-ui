import { inject, Injectable } from '@angular/core'
import { concatMap, map, Observable, switchMap } from 'rxjs'
import { SavedDataQueryData } from 'src/app/model/Interface/SavedDataQueryData'
import { SavedDataQueryListItemData } from 'src/app/model/Interface/SavedDataQueryListItemData'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { SavedDataQueryListItem } from 'src/app/model/SavedDataQuery/SavedDataQueryListItem'
import { UiCRTDL } from 'src/app/model/UiCRTDL'
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile'
import { SavedFeasibilityQueryAdapter } from 'src/app/shared/models/SavedQueryTile/SavedFeasibilityQueryAdapter'
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service'
import { CrtdlProcessingPipelineService } from '../../CrtdlProcessingPipeline.service'
import { TypeAssertion } from '../../TypeGuard/TypeAssersations'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { CheckAndUpgradeCCDLService } from '../../Upgrade/CheckAndUpgradeCCDL.service'
import { CRTDLValidationService } from '../../Validation/External/CRTDLValidation.service'

@Injectable({
  providedIn: 'root',
})
export class ReadDataQueryService {
  private readonly dataQueryApiService = inject(DataQueryApiService)
  private readonly validationService = inject(CRTDLValidationService)
  private readonly checkAndUpgradeCCDLService = inject(CheckAndUpgradeCCDLService)
  private readonly crtdlProcessingPipelineService = inject(CrtdlProcessingPipelineService)

  constructor() {}

  public readSavedQueries(): Observable<InterfaceSavedQueryTile[]> {
    return this.dataQueryApiService.getDataQuery().pipe(map((queries: SavedDataQueryListItemData[]) => this.processQueries(queries)))
  }

  private processQueries(queries: SavedDataQueryListItemData[]): InterfaceSavedQueryTile[] {
    try {
      this.assertQueries(queries)
      return queries.map((query: SavedDataQueryListItemData) => this.adaptQuery(query))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private assertQueries(queries: SavedDataQueryListItemData[]): void {
    queries.every((query: SavedDataQueryListItemData) => TypeAssertion.assertSavedDataQueryListItemData(query))
  }

  private adaptQuery(query: any): InterfaceSavedQueryTile {
    const savedDataQueryListItem = SavedDataQueryListItem.fromJson(query)
    return SavedFeasibilityQueryAdapter.adapt(savedDataQueryListItem)
  }

  /**
   * Reads a saved data query by its ID, checks and upgrades CCDL if necessary, processes CRTDL data, and returns the result as an observable.
   * @param {number} id - The ID of the saved data query to read
   * @returns {Observable<SavedDataQuery>} Observable that emits the loaded saved query with processed CRTDL data
   */
  public readDataQueryById(id: number): Observable<SavedDataQuery> {
    return this.dataQueryApiService.getDataQueryById(id).pipe(
      map((data: SavedDataQueryData) => {
        data.content = this.checkAndUpgradeCCDLService.checkAndUpgradeCCDLAsSavedData(data.content)
        return data
      }),
      concatMap((data: any) => {
        if (TypeGuard.isCRTDLData(data.content)) {
          return this.crtdlProcessingPipelineService
            .process(data.content)
            .pipe(map((crtdl: UiCRTDL) => SavedDataQuery.fromJson(data, crtdl)))
        }
      })
    )
  }

  /**
   * Gets the validation report for a saved data query by its ID.
   * @param {number} id - The ID of the saved data query to validate
   * @returns {Observable<boolean>} Observable that emits the validation result
   */
  public getValidationReportForDataquery(id: number): Observable<boolean> {
    return this.dataQueryApiService
      .getDataQueryById(id)
      .pipe(switchMap((data: SavedDataQueryData) => this.validationService.validate(data.content)))
  }
}
