import { BackendService } from 'src/app/service/Backend/Backend.service'
import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { FeasibilityQueryResultDetailsListAdapter } from '../../../../../shared/models/TableData/Adapter/FeasibilityQueryResultDetailsListAdapter'
import { FeasibilityQueryResultDetailstListEntry } from '../../../../../model/Search/ListEntries/FeasibilityQueryResultDetailstListEntry'
import {
  DetailError,
  FeasibilityQueryResultService,
} from 'src/app/service/FeasibilityQuery/Result/FeasibilityQueryResult.service'
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  of,
  Subscription,
  switchMap,
} from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { QueryResult } from '../../../../../model/Result/QueryResult'
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service'
import { TableData } from '../../../../../shared/models/TableData/TableData'
import { ModalWindowComponent } from '../../../../../shared/components/modal-window/modal-window.component'
import { HeaderComponent } from '../../../../../shared/components/header/header.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { HeaderDescriptionComponent } from '../../../../../shared/components/header-description/header-description.component'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { SnackbarService } from 'src/app/shared/service/Snackbar/Snackbar.service'
import { TranslateModule } from '@ngx-translate/core'

export class ResultDetailsModalComponentData {}
@Component({
  selector: 'num-result-detail-modal',
  templateUrl: './result-detail-modal.component.html',
  styleUrls: ['./result-detail-modal.component.scss'],
  standalone: true,
  imports: [
    ModalWindowComponent,
    HeaderComponent,
    FontAwesomeModule,
    HeaderDescriptionComponent,
    TableComponent,
    TranslateModule,
  ],
})
export class ResultDetailModalComponent implements OnInit, OnDestroy {
  private feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)
  data = inject<ResultDetailsModalComponentData>(MAT_DIALOG_DATA)
  dialogRef = inject<MatDialogRef<ResultDetailModalComponent>>(MatDialogRef)
  backend = inject(BackendService)
  private feasibilityQueryResultService = inject(FeasibilityQueryResultService)
  private resultProviderService = inject(ResultProviderService)
  private snackbarService = inject(SnackbarService)

  adaptedData: TableData
  providerSubscription: Subscription
  activeResultID: string

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * We read the last elment of the feasibilityQuery resultIds Array as this one contains the latest Result from the backend
   */
  ngOnInit(): void {
    this.providerSubscription = this.feasibilityQueryProviderService
      .getActiveFeasibilityQuery()
      .pipe(
        map((feasibilityQuery) => {
          const resultIds = feasibilityQuery.getResultIds()
          return resultIds[resultIds.length - 1]
        }),
        distinctUntilChanged(),
        filter((latestResultId) => !!latestResultId),
        // switchMap: one detail request per result id, a new emission cancels the pending one.
        switchMap((latestResultId) => {
          const latestResult = this.resultProviderService.getOne(latestResultId)
          return latestResult?.getDetailsReceived()
            ? of(latestResult)
            : this.feasibilityQueryResultService.getDetailedObfuscatedResult(latestResultId).pipe(
                // Known error code (e.g. FEAS-10004) -> snackbar message instead of the generic error dialog
                catchError(({ code, retryAfterSeconds }: DetailError) => {
                  // Remembered errors arrive synchronously inside change detection (NG0100), so defer.
                  queueMicrotask(() => {
                    this.snackbarService.displayErrorMessage(code, retryAfterSeconds)
                    this.doClose()
                  })
                  return EMPTY
                })
              )
        })
      )
      .subscribe((result) => this.setActiveResultIdAndAdaptedData(result))
  }

  private setActiveResultIdAndAdaptedData(result: QueryResult): void {
    this.activeResultID = result.getId()
    this.adaptedData = new FeasibilityQueryResultDetailsListAdapter().adapt(this.sortResult(result))
  }

  ngOnDestroy() {
    this.providerSubscription?.unsubscribe()
  }

  doClose(): void {
    this.dialogRef.close()
  }

  private sortResult(queryResult: QueryResult): FeasibilityQueryResultDetailstListEntry[] {
    return queryResult
      ?.getResultLines()
      ?.sort((a, b) => b.getNumberOfPatients() - a.getNumberOfPatients())
      .map(
        (resultLine) =>
          new FeasibilityQueryResultDetailstListEntry(
            resultLine.getNumberOfPatients(),
            resultLine.getSiteName()
          )
      )
  }
}
