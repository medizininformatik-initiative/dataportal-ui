import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { SavedDataQuery } from 'src/app/model/SavedDataQuery/SavedDataQuery'
import { SavedUsageStats } from 'src/app/model/Types/SavedUsageStats'
import { SaveDataModal } from 'src/app/shared/models/SaveDataModal/SaveDataModal'
import { InterfaceSavedQueryTile } from 'src/app/shared/models/SavedQueryTile/InterfaceSavedQueryTile'
import { DeleteDataQueryService } from './Persistence/DeleteDataQuery.service'
import { ReadDataQueryService } from './Persistence/ReadDataQuery.service'
import { SavedDataQueryService } from './Persistence/SaveDataQuery.service'

@Injectable({
  providedIn: 'root',
})
export class DataQueryStorageService {
  private readonly readDataQueryService = inject(ReadDataQueryService)
  private readonly deleteDataQueryService = inject(DeleteDataQueryService)
  private readonly saveDataQueryService = inject(SavedDataQueryService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Returns how many data queries can be saved and how many are already used.
   * @param {SaveDataModal} data
   * @returns {Observable<SavedUsageStats>}
   */
  public saveDataQuery(data: SaveDataModal): Observable<SavedUsageStats> {
    return this.saveDataQueryService.saveDataQuery(data)
  }

  /**
   * Reads all saved data queries and returns them as an array of InterfaceSavedQueryTile.
   * @returns {Observable<InterfaceSavedQueryTile[]>}
   */
  public readDataQueries(): Observable<InterfaceSavedQueryTile[]> {
    return this.readDataQueryService.readSavedQueries()
  }

  /**
   * Deletes a saved data query by its ID.
   * @param {number} id
   * @returns {Observable<void>}
   */
  public deleteDataQueryById(id: number): Observable<void> {
    return this.deleteDataQueryService.deleteDataQueryById(id)
  }

  /**
   * Read a saved data query by its ID.
   * @param {number} id
   * @returns {Observable<SavedDataQuery>}
   */
  public readDataQueryById(id: number): Observable<SavedDataQuery> {
    return this.readDataQueryService.readDataQueryById(id)
  }

  /**
   * Opens the validation report for a saved data query by its ID.
   * @param {number} id
   * @returns {Observable<boolean>}
   */
  public getValidationReportForDataquery(id: number): Observable<boolean> {
    return this.readDataQueryService.getValidationReportForDataquery(id)
  }
}
