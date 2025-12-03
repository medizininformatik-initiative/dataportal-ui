import { CreateCRDTLService } from '../../Translator/CRTDL/CreateCRDTL.service';
import { CRTDL } from 'src/app/model/CRTDL/DataExtraction/CRTDL';
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, switchMap, take } from 'rxjs';
import { QueryResult } from 'src/app/model/Result/QueryResult';
import { ResultProviderService } from '../../Provider/ResultProvider.service';
import { SaveDataModal } from '../../../shared/models/SaveDataModal/SaveDataModal';
import { SavedUsageStats } from 'src/app/model/Types/SavedUsageStats';

@Injectable({
  providedIn: 'root',
})
export class SavedDataQueryService {
  constructor(
    private createCRDTLService: CreateCRDTLService,
    private resultProvider: ResultProviderService,
    private dataQueryApiService: DataQueryApiService
  ) {}

  public saveDataQuery(data: SaveDataModal | null = null): Observable<SavedUsageStats> {
    return this.createCRDTLService
      .createCRDTLForSave(data?.feasibilityQuery, data?.dataSelection)
      .pipe(
        switchMap((crtdl: CRTDL) => this.buildSavedDataQueryData(crtdl, data)),
        switchMap((savedDataQueryData) => this.postDataQuery(savedDataQueryData)),
        take(1)
      );
  }

  private buildSavedDataQueryData(crtdl: CRTDL, data: SaveDataModal | null): Observable<any> {
    return this.getResultSize().pipe(
      map((result: QueryResult) => ({
        content: this.createCrtdlJson(crtdl),
        comment: data?.comment || '',
        label: data?.title || '',
        resultSize: result?.getTotalNumberOfPatients() ?? 0,
      }))
    );
  }

  private createCrtdlJson(crtdl: CRTDL) {
    return {
      display: crtdl.getDisplay(),
      version: crtdl.getVersion(),
      cohortDefinition: crtdl.getCohortDefinition(),
      dataExtraction: crtdl.getDataExtraction(),
    };
  }

  private getResultSize(): Observable<QueryResult> {
    return this.resultProvider.getResultOfActiveFeasibilityQuery();
  }

  private postDataQuery(data: any): Observable<SavedUsageStats> {
    return this.dataQueryApiService.postDataQuery(data).pipe(
      take(1),
      map((response) => response.body)
    );
  }
}
