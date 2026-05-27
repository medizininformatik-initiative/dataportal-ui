import { BackendService } from '../Backend.service'
import { ChunkedRequestService } from './ChunkedRequest.service'
import { CodeableConceptPaths } from '../Paths/CodeableConceptPaths'
import { ConceptData } from 'src/app/model/Interface/ConceptData'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CodeableConceptBulkSearchPostData } from 'src/app/model/Interface/CodeableConceptBulkSearchPostData'
import { CodeableConceptBulkSearchResponse } from 'src/app/model/Interface/CodeableConceptBulkSearchResponse'

@Injectable({
  providedIn: 'root',
})
export class CodeableConceptApiService {
  private backendService = inject(BackendService)
  private http = inject(HttpClient)
  private chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves codeable concepts by their IDs.
   * @param ids - The IDs of the codeable concepts.
   * @returns - An observable containing the codeable concepts.
   */
  public getCodeableConceptsByIds(ids: string[]): Observable<Array<ConceptData>> {
    return this.chunkedRequestService.getChunkedRequest(
      ids,
      CodeableConceptPaths.ENTRY_CONCEPT_ENDPOINT
    )
  }

  /**
   * Performs a bulk search for codeable concepts.
   * @param body
   * @returns
   */
  public postCodeableConceptBulkSearch(
    body: CodeableConceptBulkSearchPostData
  ): Observable<CodeableConceptBulkSearchResponse> {
    return this.http.post<CodeableConceptBulkSearchResponse>(
      this.backendService.createUrl(CodeableConceptPaths.BULK_CONCEPT_ENDPOINT),
      body
    )
  }
}
