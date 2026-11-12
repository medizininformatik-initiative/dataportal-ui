import { Component, OnDestroy, OnInit, inject, output } from '@angular/core'
import { FeasibilityQuery } from '../../../../../model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from '../../../../../service/Provider/FeasibilityQueryProvider.service'
import {
  DetailError,
  FeasibilityQueryResultService,
} from '../../../../../service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  pairwise,
  Subject,
  Subscription,
  switchMap,
  take,
} from 'rxjs'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultRateLimit } from 'src/app/model/Result/QueryResultRateLimit'
import {
  ResultDetailModalComponent,
  ResultDetailsModalComponentData,
} from '../result-detail-modal/result-detail-modal.component'
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { PatientCountComponent } from '../patient-count/patient-count.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { MatTooltip } from '@angular/material/tooltip'
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

type QueryResponseType = QueryResult | ErrorQueryResult | null

@Component({
  selector: 'num-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss'],
  standalone: true,
  imports: [
    PatientCountComponent,
    ButtonComponent,
    MatTooltip,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SimpleResultComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog)
  private feasibilityQueryResultService = inject(FeasibilityQueryResultService)
  private queryProviderService = inject(FeasibilityQueryProviderService)
  private appSettingsProviderService = inject(AppSettingsProviderService)
  private snackbarService = inject(SnackbarService)

  showSpinner = false

  pollingTime: number
  patientCountArray: string[] = []

  public isQueryExpired = false
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private receivedResult = false
  private receivedError = false

  queryResultRateLimit$: Observable<QueryResultRateLimit>
  loadedResult = false

  activeFeasibilityQuerySusbscription: Subscription

  doSendSusbscription: Subscription

  modalSubscription: Subscription

  totalNumberOfPatients: number

  readonly resultLoaded = output<boolean>()

  feasibilityQuery: FeasibilityQuery

  constructor() {
    this.queryResultRateLimit$ = this.feasibilityQueryResultService.getDetailedResultRateLimit()
    this.pollingTime = this.appSettingsProviderService.getPollingTimeUi()
  }

  private destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.activeFeasibilityQuerySusbscription = this.queryProviderService
      .getActiveFeasibilityQuery()
      .pipe(
        filter((feasibilityQuery) => feasibilityQuery.getInclusionCriteria().length > 0),
        // Provider emits on every change of the query map: send again only if the criteria changed.
        distinctUntilChanged(
          (a, b) =>
            JSON.stringify([a.getInclusionCriteria(), a.getExclusionCriteria()]) ===
            JSON.stringify([b.getInclusionCriteria(), b.getExclusionCriteria()])
        )
      )
      .subscribe({
        next: () => this.doSend(),
        error: (err) => console.error('Error fetching feasibility query', err),
      })
  }

  ngOnDestroy(): void {
    this.activeFeasibilityQuerySusbscription?.unsubscribe()
    this.doSendSusbscription?.unsubscribe()
    this.modalSubscription?.unsubscribe()
    this.clearExpirationTimer()
    this.destroy$.next()
    this.destroy$.complete()
  }

  private doSend(): void {
    this.initializeState()
    this.doSendSusbscription?.unsubscribe()

    const obs = this.feasibilityQueryResultService.doSendQueryRequest()

    this.doSendSusbscription = this.createDoSendSubscription(obs)
  }

  /**
   * Handles the subscription logic separately.
   */
  private createDoSendSubscription(obs: Observable<QueryResponseType>): Subscription {
    return obs.pipe(pairwise()).subscribe({
      next: ([prev, current]) => this.handleQueryResults(prev, current),
      error: (error) => this.handleQueryError(error),
      complete: () => this.handleComplete(),
    })
  }

  /**
   * Handles the logic for processing the query results.
   */
  private handleQueryResults(prev: QueryResponseType, current: QueryResponseType): void {
    if (this.shouldFinalize(prev, current)) {
      this.finalize()
      this.handleResult(prev as QueryResult)
    } else if (this.shouldHandleError(prev, current)) {
      console.error('Received an error result:', prev)
      this.receivedError = true
      this.snackbarService.displayErrorMessage(prev?.getIssues()?.[0]?.getCode())
      this.showSpinner = false
    } else if (this.shouldHandleValidResult(current)) {
      this.handleResult(current as QueryResult)
    }
  }

  /**
   * Checks if we should finalize the process.
   */
  private shouldFinalize(prev: QueryResponseType, current: QueryResponseType): boolean {
    return this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle an error result.
   */
  private shouldHandleError(prev: QueryResponseType, current: QueryResponseType): boolean {
    return !this.isQueryResult(prev) && current === null
  }

  /**
   * Checks if we should handle a valid query result.
   */
  private shouldHandleValidResult(current: QueryResponseType): boolean {
    return this.isQueryResult(current)
  }

  /**
   * Type guard to check if an object is a QueryResult.
   */
  private isQueryResult(result: QueryResponseType): result is QueryResult {
    return result?.getTotalNumberOfPatients() !== null
  }

  /**
   * Handles errors in the query request.
   */
  private handleQueryError(error: any): void {
    console.error('Error fetching query result', error)
    this.showSpinner = false
    this.snackbarService.displayErrorMessage(
      error?.payload?.[0]?.code ?? 'RESULT_FAILED',
      error?.retryAfterSeconds
    )
  }

  /**
   * Polling time is over. Without any result, tell the user instead of showing empty digits.
   */
  private handleComplete(): void {
    this.finalize()
    if (!this.receivedResult && !this.receivedError) {
      this.snackbarService.displayErrorMessage('RESULT_TIMEOUT')
    }
  }

  /**
   * Requests the details first and opens the modal only on success, so a failed request
   * (e.g. below privacy threshold) shows its message and never flashes an empty modal.
   */
  openDialogResultDetails(): void {
    this.modalSubscription?.unsubscribe()
    const dialogConfig = new MatDialogConfig<ResultDetailsModalComponentData>()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    this.modalSubscription = this.queryProviderService
      .getActiveFeasibilityQuery()
      .pipe(
        take(1),
        map((feasibilityQuery) => {
          const resultIds = feasibilityQuery.getResultIds()
          return resultIds[resultIds.length - 1]
        }),
        switchMap((latestResultId) =>
          this.feasibilityQueryResultService.getDetailedObfuscatedResult(latestResultId)
        ),
        switchMap(() => this.dialog.open(ResultDetailModalComponent, dialogConfig).afterClosed())
      )
      .subscribe({
        next: () => this.feasibilityQueryResultService.refreshResultRateLimit(),
        error: ({ code, retryAfterSeconds }: DetailError) => {
          this.snackbarService.displayErrorMessage(code, retryAfterSeconds)
          this.feasibilityQueryResultService.refreshResultRateLimit()
        },
      })
  }

  private initializeState(): void {
    this.loadedResult = false
    this.showSpinner = true
    this.receivedResult = false
    this.receivedError = false
    this.isQueryExpired = false
    this.clearExpirationTimer()
  }

  private handleResult(result: QueryResult): void {
    if (!this.receivedResult) {
      this.receivedResult = true
      // Backend result expires from its first result on, not from sending the query.
      this.startExpirationTimer(this.feasibilityQueryResultService.remainingExpiryMs())
    }
    this.totalNumberOfPatients = result.getTotalNumberOfPatients()
    this.setPatientCount(result.getTotalNumberOfPatients())
    this.resultLoaded.emit(this.loadedResult)
  }

  /**
   * If the result array has fewer than 10 digits, pad it with leading '0' digits until its length is 10
   */
  private setPatientCount(totalNumberOfPatients: number): void {
    const patientCountArray = totalNumberOfPatients?.toString()?.split('') ?? []
    const lengthOfDigitFields = 8
    while (patientCountArray.length < lengthOfDigitFields) {
      patientCountArray.unshift('0')
    }
    this.patientCountArray = patientCountArray
  }

  private finalize(): void {
    this.loadedResult = true
    this.showSpinner = false
  }

  private clearExpirationTimer(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private startExpirationTimer(durationMs: number) {
    this.timeoutId = setTimeout(() => {
      this.isQueryExpired = true
    }, durationMs)
  }
}
