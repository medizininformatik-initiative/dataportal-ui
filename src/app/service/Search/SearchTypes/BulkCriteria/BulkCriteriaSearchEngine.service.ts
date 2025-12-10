import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData';
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData';
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList';
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes';
import { FilterProvider } from '../../Filter/SearchFilterProvider.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TerminologyApiService } from 'src/app/service/Backend/Api/TerminologyApi.service';

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaSearchEngineService {
  constructor(
    private filterProvider: FilterProvider,
    private terminologyApiService: TerminologyApiService
  ) {}

  /**
   * Search by bulk criteria.
   * @param searchterms
   * @returns
   */
  public search(searchterms: string): Observable<CriteriaBulkResultList> {
    const body = this.createPostData(searchterms);
    return this.terminologyApiService
      .postTerminologyBulkSearch(body)
      .pipe(map((response: BulkSearchResponseData) => CriteriaBulkResultList.fromJson(response)));
  }

  /**
   * Returns the post data for bulk search.
   * @param searchterms
   * @returns
   */
  private createPostData(searchterms: string): BulkSearchPostData {
    const selectedTerminologies = this.getTerminologyFilter();
    const selectedContext = this.getContextFilter();
    const parsedSearchTerms = searchterms.split(/[\s,;]+/).filter(Boolean);
    return {
      searchterms: parsedSearchTerms,
      terminology: selectedTerminologies,
      context: selectedContext,
    };
  }

  /**
   * Returns the selected terminology filter as a comma-separated string.
   * @returns
   */
  private getTerminologyFilter(): string {
    return this.filterProvider
      .getSelectedValuesOfType(ElasticSearchFilterTypes.TERMINOLOGY)
      .join(',');
  }

  /**
   * Rteturns the selected context filter as a comma-separated string.
   * @returns
   */
  private getContextFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.CONTEXT).join(',');
  }
}
