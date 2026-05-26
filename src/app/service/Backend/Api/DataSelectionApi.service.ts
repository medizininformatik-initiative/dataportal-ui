import { BackendService } from '../Backend.service'
import { ChunkedRequestService } from './ChunkedRequest.service'
import { DataSelectionPaths } from '../Paths/DataSelectionPaths'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionApiService {
  private http = inject(HttpClient)
  private backendService = inject(BackendService)
  private chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getDataSelectionProfileData(ids: string[]) {
    const path = DataSelectionPaths.PROFILE_DATA_ENDPOINT
    return this.chunkedRequestService.getChunkedRequest(ids, path)
  }

  public getDataSelectionProfileTree() {
    return this.http.get<any>(
      this.backendService.createUrl(DataSelectionPaths.PROFILE_TREE_ENDPOINT)
    )
  }
}
