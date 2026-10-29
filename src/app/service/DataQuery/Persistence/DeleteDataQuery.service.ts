import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service'

@Injectable({
  providedIn: 'root',
})
export class DeleteDataQueryService {
  private readonly dataQueryApiService = inject(DataQueryApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * deletes a saved data query by its ID.
   * @param {number} id
   * @returns {Observable<void>}
   */
  public deleteDataQueryById(id: number): Observable<void> {
    return this.dataQueryApiService.deleteDataQueryById(id)
  }
}
