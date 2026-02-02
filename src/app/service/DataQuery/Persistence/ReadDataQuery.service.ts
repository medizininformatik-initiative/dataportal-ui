import { CRTDL2UIModelService } from '../../Translator/CRTDL/CRTDL2UIModel.service';
import { CRTDLValidationService } from '../../Validation/CRTDLValidation.service';
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service';
import { map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile';
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery';
import { SavedDataQueryData } from 'src/app/model/Interface/SavedDataQueryData';
import { SavedDataQueryListItem } from 'src/app/model/SavedDataQuery/SavedDataQueryListItem';
import { SavedDataQueryListItemData } from 'src/app/model/Interface/SavedDataQueryListItemData';
import { SavedFeasibilityQueryAdapter } from 'src/app/shared/models/SavedQueryTile/SavedFeasibilityQueryAdapter';
import { TypeAssertion } from '../../TypeGuard/TypeAssersations';

@Injectable({
  providedIn: 'root',
})
export class ReadDataQueryService {
  constructor(
    private dataQueryApiService: DataQueryApiService,
    private crtdl2UIModelService: CRTDL2UIModelService,
    private validationService: CRTDLValidationService
  ) {}

  public readSavedQueries(): Observable<InterfaceSavedQueryTile[]> {
    return this.dataQueryApiService
      .getDataQuery()
      .pipe(map((queries) => this.processQueries(queries)));
  }

  private processQueries(queries: SavedDataQueryListItemData[]): InterfaceSavedQueryTile[] {
    try {
      this.assertQueries(queries);
      return queries.map((query) => this.adaptQuery(query));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private assertQueries(queries: SavedDataQueryListItemData[]): void {
    queries.every((query) => TypeAssertion.assertSavedDataQueryListItemData(query));
  }

  private adaptQuery(query: any): InterfaceSavedQueryTile {
    const savedDataQueryListItem = SavedDataQueryListItem.fromJson(query);
    return SavedFeasibilityQueryAdapter.adapt(savedDataQueryListItem);
  }

  public readDataQueryById(id: number): Observable<SavedDataQuery> {
    return this.dataQueryApiService.getDataQueryById(id).pipe(
      switchMap((data: SavedDataQueryData) => {
        TypeAssertion.assertSavedDataQueryData(data);
        return this.transformDataQuery(data);
      })
    );
  }

  public getValidationReportForDataquery(id: number): Observable<boolean> {
    return this.dataQueryApiService
      .getDataQueryById(id)
      .pipe(switchMap((data: SavedDataQueryData) => this.validationService.validate(data.content)));
  }

  private transformDataQuery(data: SavedDataQueryData): Observable<SavedDataQuery> {
    return this.crtdl2UIModelService
      .createCRTDLFromJson(data.content)
      .pipe(map((uiCRTDL) => SavedDataQuery.fromJson(data, uiCRTDL)));
  }
}
