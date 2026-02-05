import { DeleteDataQueryService } from './Persistence/DeleteDataQuery.service';
import { Injectable } from '@angular/core';
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile';
import { Observable } from 'rxjs';
import { ReadDataQueryService } from './Persistence/ReadDataQuery.service';
import { SaveDataModal } from 'src/app/shared/models/SaveDataModal/SaveDataModal';
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery';
import { SavedDataQueryService } from './Persistence/SaveDataQuery.service';
import { SavedUsageStats } from 'src/app/model/Types/SavedUsageStats';

@Injectable({
  providedIn: 'root',
})
export class DataQueryStorageService {
  constructor(
    private readDataQueryService: ReadDataQueryService,
    private deleteDataQueryService: DeleteDataQueryService,
    private saveDataQueryService: SavedDataQueryService
  ) {}

  /**
   * Returns how many data queries can be saved and how many are already used.
   * @param data
   * @returns
   */
  public saveDataQuery(data: SaveDataModal): Observable<SavedUsageStats> {
    return this.saveDataQueryService.saveDataQuery(data);
  }

  /**
   * Reads all saved data queries and returns them as an array of InterfaceSavedQueryTile.
   * @returns
   */
  public readDataQueries(): Observable<InterfaceSavedQueryTile[]> {
    return this.readDataQueryService.readSavedQueries();
  }

  /**
   * Deletes a saved data query by its ID.
   * @param id
   * @returns
   */
  public deleteDataQueryById(id: number): Observable<void> {
    return this.deleteDataQueryService.deleteDataQueryById(id);
  }

  /**
   * Read a saved data query by its ID.
   * @param id
   * @returns
   */
  public readDataQueryById(id: number): Observable<SavedDataQuery> {
    return this.readDataQueryService.readDataQueryById(id);
  }

  /**
   * Opens the validation report for a saved data query by its ID.
   * @param id
   * @returns
   */
  public getValidationReportForDataquery(id: number): Observable<boolean> {
    return this.readDataQueryService.getValidationReportForDataquery(id);
  }
}
