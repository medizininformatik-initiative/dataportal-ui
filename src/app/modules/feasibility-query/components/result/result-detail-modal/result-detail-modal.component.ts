import { BackendService } from 'src/app/service/Backend/Backend.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service';
import { FeasibilityQueryResultDetailsListAdapter } from '../../../../../shared/models/TableData/Adapter/FeasibilityQueryResultDetailsListAdapter';
import { FeasibilityQueryResultDetailstListEntry } from '../../../../../model/Search/ListEntries/FeasibilityQueryResultDetailstListEntry';
import { FeasibilityQueryResultService } from 'src/app/service/FeasibilityQuery/Result/FeasibilityQueryResult.service';
import { map, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QueryResult } from '../../../../../model/Result/QueryResult';
import { ResultProviderService } from 'src/app/service/Provider/ResultProvider.service';
import { TableData } from '../../../../../shared/models/TableData/TableData';

export class ResultDetailsModalComponentData {}
@Component({
  selector: 'num-result-detail-modal',
  templateUrl: './result-detail-modal.component.html',
  styleUrls: ['./result-detail-modal.component.scss'],
})
export class ResultDetailModalComponent implements OnInit, OnDestroy {
  adaptedData: TableData;
  providerSubscription: Subscription;
  resultServiceSubscription: Subscription;
  activeResultID: string;

  constructor(
    private feasibilityQueryProviderService: FeasibilityQueryProviderService,
    @Inject(MAT_DIALOG_DATA) public data: ResultDetailsModalComponentData,
    public dialogRef: MatDialogRef<ResultDetailModalComponent>,
    public backend: BackendService,
    private feasibilityQueryResultService: FeasibilityQueryResultService,
    private resultProviderService: ResultProviderService
  ) {}

  /**
   * We read the last elment of the feasibilityQuery resultIds Array as this one contains the latest Result from the backend
   */
  ngOnInit(): void {
    this.providerSubscription = this.feasibilityQueryProviderService
      .getActiveFeasibilityQuery()
      .pipe(
        map((feasibilityQuery) => {
          const resultIdsArray = feasibilityQuery.getResultIds();
          const latestResultId = resultIdsArray[resultIdsArray.length - 1];
          const latestResult = this.resultProviderService.getResultByID(latestResultId);
          if (latestResult.getDetailsReceived()) {
            this.setActiveResultIdAndAdaptedData(latestResult);
          } else {
            this.resultServiceSubscription = this.feasibilityQueryResultService
              .getDetailedObfuscatedResult(latestResultId)
              .subscribe((result) => {
                this.setActiveResultIdAndAdaptedData(result);
              });
          }
        })
      )
      .subscribe();
  }

  private setActiveResultIdAndAdaptedData(result: QueryResult): void {
    this.activeResultID = result.getId();
    this.adaptedData = new FeasibilityQueryResultDetailsListAdapter().adapt(this.sortResult(result));
  }

  ngOnDestroy() {
    this.providerSubscription?.unsubscribe();
    this.resultServiceSubscription?.unsubscribe();
  }

  doClose(): void {
    this.dialogRef.close();
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
      );
  }
}
