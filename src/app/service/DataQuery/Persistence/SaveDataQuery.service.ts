import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap, take } from 'rxjs'
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { SavedUsageStats } from 'src/app/model/Types/SavedUsageStats'
import { SaveDataModal } from '../../../shared/models/SaveDataModal/SaveDataModal'
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service'
import { ResultProviderService } from '../../Provider/ResultProvider.service'
import { CreateCRTDLService } from '../../Translator/CRTDL/CreateCRTDL.service'

@Injectable({
  providedIn: 'root',
})
export class SavedDataQueryService {
  private readonly createCRTDLService = inject(CreateCRTDLService)
  private readonly resultProvider = inject(ResultProviderService)
  private readonly dataQueryApiService = inject(DataQueryApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates the CRTDL and saves it as a data query.
   * @param {SaveDataModal | null} data
   * @returns {Observable<SavedUsageStats>}
   */
  public saveDataQuery(data: SaveDataModal | null = null): Observable<SavedUsageStats> {
    return this.createCRTDLService.createCRTDLForSave().pipe(
      switchMap((crtdl: CRTDL) => this.buildSavedDataQueryData(crtdl, data)),
      switchMap((savedDataQueryData) => this.postDataQuery(savedDataQueryData)),
      take(1)
    )
  }

  /**
   * Builds the data query to save from the CRTDL, the result size and the modal data.
   * @param {CRTDL} crtdl
   * @param {SaveDataModal | null} data
   * @returns {Observable<any>}
   */
  private buildSavedDataQueryData(crtdl: CRTDL, data: SaveDataModal | null): Observable<any> {
    return this.getResultSize().pipe(
      map((result: QueryResult) => ({
        content: this.createCrtdlJson(crtdl),
        comment: data?.comment || '',
        label: data?.title || '',
        resultSize: result?.getTotalNumberOfPatients() ?? 0,
      }))
    )
  }

  /**
   * Creates the crtdl json.
   *
   * @param {CRTDL} crtdl
   * @returns {{ display: string; version: string; cohortDefinition: CCDLCohortDefinition; dataExtraction: DataExtraction; }}
   */
  private createCrtdlJson(crtdl: CRTDL) {
    return {
      display: crtdl.getDisplay(),
      version: crtdl.getVersion(),
      cohortDefinition: crtdl.getCohortDefinition(),
      dataExtraction: crtdl.getDataExtraction(),
    }
  }

  /**
   * Returns the result of the active feasibility query.
   * @returns {Observable<QueryResult>}
   */
  private getResultSize(): Observable<QueryResult> {
    return this.resultProvider.getResultOfActiveFeasibilityQuery()
  }

  /**
   * Posts the data query and returns the usage stats from the response.
   * @param {any} data
   * @returns {Observable<SavedUsageStats>}
   */
  private postDataQuery(data: any): Observable<SavedUsageStats> {
    return this.dataQueryApiService.postDataQuery(data).pipe(
      take(1),
      map((response) => response.body)
    )
  }
}
