import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class DeleteDataQueryService {
  private dataQueryApiService = inject(DataQueryApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * deletes a saved data query by its ID.
   * @param id
   * @returns
   */
  public deleteDataQueryById(id: number): Observable<void> {
    return this.dataQueryApiService.deleteDataQueryById(id)
  }
}
