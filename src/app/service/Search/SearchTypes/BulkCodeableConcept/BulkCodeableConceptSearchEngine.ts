import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { CodeableConceptBulkSearchPostData } from 'src/app/model/Interface/CodeableConceptBulkSearchPostData'
import { CodeableConceptBulkSearchResponse } from 'src/app/model/Interface/CodeableConceptBulkSearchResponse'
import { CodeableConceptBulkResultList } from 'src/app/model/Search/ResultList/CodeableConceptBulkResultList'
import { CodeableConceptApiService } from 'src/app/service/Backend/Api/CodeableConceptApi.service'

@Injectable({
  providedIn: 'root',
})
export class BulkCodeableConceptSearchEngineService {
  private readonly codeableConceptApiService = inject(CodeableConceptApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Search by bulk criteria.
   * @param {string} searchterms
   * @returns {Observable<CodeableConceptBulkResultList>}
   * @param {string} valueSet
   */
  public search(searchterms: string, valueSet: string): Observable<CodeableConceptBulkResultList> {
    const body = this.createPostData(searchterms, valueSet)
    return this.codeableConceptApiService
      .postCodeableConceptBulkSearch(body)
      .pipe(map((response: CodeableConceptBulkSearchResponse) => CodeableConceptBulkResultList.fromJson(response)))
  }

  /**
   * Returns the post data for bulk search.
   * @param {string} searchterms
   *	@param {string} valueSet
   *  @returns {CodeableConceptBulkSearchPostData}
   */
  private createPostData(searchterms: string, valueSet: string): CodeableConceptBulkSearchPostData {
    const parsedSearchTerms = searchterms.split(/[\s,;]+/).filter(Boolean)
    return {
      valueSet,
      searchterms: parsedSearchTerms,
    }
  }
}
