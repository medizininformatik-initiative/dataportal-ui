import { CodeableConceptApiService } from 'src/app/service/Backend/Api/CodeableConceptApi.service';
import { CodeableConceptBulkResultList } from 'src/app/model/Search/ResultList/CodeableConceptBulkResultList';
import { CodeableConceptBulkSearchPostData } from 'src/app/model/Interface/CodeableConceptBulkSearchPostData';
import { CodeableConceptBulkSearchResponse } from 'src/app/model/Interface/CodeableConceptBulkSearchResponse';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BulkCodeableConceptSearchEngineService {
  constructor(private codeableConceptApiService: CodeableConceptApiService) {}

  /**
   * Search by bulk criteria.
   * @param searchterms
   * @returns
   */
  public search(searchterms: string, valueSet: string): Observable<CodeableConceptBulkResultList> {
    const body = this.createPostData(searchterms, valueSet);
    return this.codeableConceptApiService
      .postCodeableConceptBulkSearch(body)
      .pipe(
        map((response: CodeableConceptBulkSearchResponse) =>
          CodeableConceptBulkResultList.fromJson(response)
        )
      );
  }

  /**
   * Returns the post data for bulk search.
   * @param searchterms
   *	@param valueSet
   *  @returns
   */
  private createPostData(searchterms: string, valueSet: string): CodeableConceptBulkSearchPostData {
    const parsedSearchTerms = searchterms.split(/[\s,;]+/).filter(Boolean);
    return {
      valueSet,
      searchterms: parsedSearchTerms,
    };
  }
}
