import { DataQueryApiService } from '../../Backend/Api/DataQueryApi.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteDataQueryService {
  constructor(private dataQueryApiService: DataQueryApiService) {}

  /**
   * deletes a saved data query by its ID.
   * @param id
   * @returns
   */
  public deleteDataQueryById(id: number): Observable<void> {
    return this.dataQueryApiService.deleteDataQueryById(id);
  }
}
