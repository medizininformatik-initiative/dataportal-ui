import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap } from 'rxjs'
import { CCDLCohortDefinition } from 'src/app/model/CohortDefinition/CCDLCohortDefinition'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { FeasibilityQueryApiService } from '../../../Backend/Api/FeasibilityQueryApi.service'
import { FeasibilityQueryResultApiService } from '../../../Backend/Api/FeasibilityQueryResultApi.service'
import { ToCohortDefinitionService } from '../../../Translator/StructureQuery/ToCohortDefinition.service'

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private readonly feasibilityQueryResultApiService = inject(FeasibilityQueryResultApiService)
  private readonly appSettingsProviderService = inject(AppSettingsProviderService)
  private readonly feasibilityQueryApiService = inject(FeasibilityQueryApiService)
  private readonly translator = inject(ToCohortDefinitionService)

  private readonly POLLING_INTERVALL_MILLISECONDS = this.appSettingsProviderService.getResultSummaryPollingInterval()
  private readonly POLLING_MAXL_MILLISECONDS = this.appSettingsProviderService.getPollingTimeUi()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves a summary of the query result.
   *
   * @param {string} resultId The ID of the feasibility query result.
   * @returns {Observable<any>}
   */
  public requestSummaryResult(resultId: string): Observable<any> {
    return this.feasibilityQueryResultApiService.getSummaryResult(resultId)
  }

  public getFeasibilityIdFromPollingUrl(): Observable<string> {
    return this.translator.getActive().pipe(
      switchMap((cohortDefinition: CCDLCohortDefinition) => this.feasibilityQueryApiService.postStructuredQuery(cohortDefinition)),
      map((result) => {
        const pollingUrl = result.headers.get('location')
        return pollingUrl.substring(pollingUrl.lastIndexOf('/') + 1)
      })
    )
  }

  /**
   * If the polling intervall exceeds the max polling time, it returns the max polling time.
   * @returns {number} The polling interval in milliseconds
   */
  public getPollingInterval(): number {
    const pollingIntervall =
      this.POLLING_INTERVALL_MILLISECONDS > this.POLLING_MAXL_MILLISECONDS
        ? this.POLLING_MAXL_MILLISECONDS
        : this.POLLING_INTERVALL_MILLISECONDS
    return pollingIntervall * 1000
  }

  /**
   * Returns the polling time.
   *
   * @returns {number} The polling time
   */
  public getPollingTime(): number {
    return this.POLLING_MAXL_MILLISECONDS * 1000
  }
}
