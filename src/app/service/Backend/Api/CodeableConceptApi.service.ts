import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CodeableConceptBulkSearchPostData } from 'src/app/model/Interface/CodeableConceptBulkSearchPostData'
import { CodeableConceptBulkSearchResponse } from 'src/app/model/Interface/CodeableConceptBulkSearchResponse'
import { ConceptData } from 'src/app/model/Interface/ConceptData'
import { BackendService } from '../Backend.service'
import { CodeableConceptPaths } from '../Paths/CodeableConceptPaths'
import { ChunkedRequestService } from './ChunkedRequest.service'

@Injectable({
  providedIn: 'root',
})
export class CodeableConceptApiService {
  private readonly backendService = inject(BackendService)
  private readonly http = inject(HttpClient)
  private readonly chunkedRequestService = inject(ChunkedRequestService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves codeable concepts by their IDs.
   * @param {string[]} ids - The IDs of the codeable concepts.
   * @returns {Observable<Array<ConceptData>>} - An observable containing the codeable concepts.
   */
  public getCodeableConceptsByIds(ids: string[]): Observable<Array<ConceptData>> {
    return this.chunkedRequestService.getChunkedRequest(ids, CodeableConceptPaths.ENTRY_CONCEPT_ENDPOINT)
  }

  /**
   * Performs a bulk search for codeable concepts.
   * @param {CodeableConceptBulkSearchPostData} body
   * @returns {Observable<CodeableConceptBulkSearchResponse>}
   */
  public postCodeableConceptBulkSearch(body: CodeableConceptBulkSearchPostData): Observable<CodeableConceptBulkSearchResponse> {
    return this.http.post<CodeableConceptBulkSearchResponse>(
      this.backendService.createUrl(CodeableConceptPaths.BULK_CONCEPT_ENDPOINT),
      body
    )
  }
}
