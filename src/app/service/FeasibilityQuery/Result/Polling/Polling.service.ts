import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { FeasibilityQueryApiService } from '../../../Backend/Api/FeasibilityQueryApi.service'
import { FeasibilityQueryResultApiService } from '../../../Backend/Api/FeasibilityQueryResultApi.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable, switchMap } from 'rxjs'
import { ToCohortDefinitionService } from '../../../Translator/StructureQuery/ToCohortDefinition.service'

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private feasibilityQueryResultApiService = inject(FeasibilityQueryResultApiService)
  private appSettingsProviderService = inject(AppSettingsProviderService)
  private feasibilityQueryApiService = inject(FeasibilityQueryApiService)
  private translator = inject(ToCohortDefinitionService)

  private readonly POLLING_INTERVALL_MILLISECONDS = this.appSettingsProviderService.getResultSummaryPollingInterval()
  private readonly POLLING_MAXL_MILLISECONDS = this.appSettingsProviderService.getPollingTimeUi()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves a summary of the query result.
   *
   * @param resultId The ID of the feasibility query result.
   */
  public requestSummaryResult(resultId: string): Observable<any> {
    return this.feasibilityQueryResultApiService.getSummaryResult(resultId)
  }

  public getFeasibilityIdFromPollingUrl(): Observable<string> {
    return this.translator.getActive().pipe(
      switchMap((cohortDefinition) => this.feasibilityQueryApiService.postStructuredQuery(cohortDefinition)),
      map((result) => {
        const pollingUrl = result.headers.get('location')
        return pollingUrl.substring(pollingUrl.lastIndexOf('/') + 1)
      })
    )
  }

  /**
   * If the polling intervall exceeds the max polling time, it returns the max polling time.
   * @returns The polling interval in milliseconds
   */
  public getPollingInterval(): number {
    const pollingIntervall =
      this.POLLING_INTERVALL_MILLISECONDS > this.POLLING_MAXL_MILLISECONDS
        ? this.POLLING_MAXL_MILLISECONDS
        : this.POLLING_INTERVALL_MILLISECONDS
    return pollingIntervall * 1000
  }

  /**
   *
   * @returns The polling time
   */
  public getPollingTime(): number {
    return this.POLLING_MAXL_MILLISECONDS * 1000
  }
}
