import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryApiService } from '../../../Backend/Api/FeasibilityQueryApi.service'
import { FeasibilityQueryResultApiService } from '../../../Backend/Api/FeasibilityQueryResultApi.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { UIQuery2StructuredQueryService } from '../../../Translator/StructureQuery/UIQuery2StructuredQuery.service'

const DEFAULT_POLLING_INTERVAL_SECONDS = 15
const DEFAULT_POLLING_TIME_SECONDS = 60

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private feasibilityQueryResultApiService = inject(FeasibilityQueryResultApiService)
  private appSettingsProviderService = inject(AppSettingsProviderService)
  private feasibilityQueryApiService = inject(FeasibilityQueryApiService)
  private translator = inject(UIQuery2StructuredQueryService)

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

  public getFeasibilityIdFromPollingUrl(query: FeasibilityQuery): Observable<string> {
    return this.feasibilityQueryApiService
      .postStructuredQuery(this.translator.translateToStructuredQuery(query))
      .pipe(
        map((result) => {
          const pollingUrl = result.headers.get('location')
          if (!pollingUrl) {
            throw new Error('Feasibility query response has no location header')
          }
          return pollingUrl.substring(pollingUrl.lastIndexOf('/') + 1)
        })
      )
  }

  /**
   * If the polling intervall exceeds the max polling time, it returns the max polling time.
   * Settings are read on every call, so they are never stale or empty from service creation.
   * @returns The polling interval in milliseconds
   */
  public getPollingInterval(): number {
    const interval = this.positiveOrDefault(
      this.appSettingsProviderService.getResultSummaryPollingInterval(),
      DEFAULT_POLLING_INTERVAL_SECONDS
    )
    return Math.min(interval, this.getPollingTime() / 1000) * 1000
  }

  /**
   *
   * @returns The polling time
   */
  public getPollingTime(): number {
    return (
      this.positiveOrDefault(
        this.appSettingsProviderService.getPollingTimeUi(),
        DEFAULT_POLLING_TIME_SECONDS
      ) * 1000
    )
  }

  /**
   * An unset or malformed setting parses to NaN or 0, which would make `interval()` fire at once.
   */
  private positiveOrDefault(seconds: number, fallback: number): number {
    return Number.isFinite(seconds) && seconds > 0 ? seconds : fallback
  }
}
