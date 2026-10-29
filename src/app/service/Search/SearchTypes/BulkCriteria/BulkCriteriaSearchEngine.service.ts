import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData'
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { TerminologyApiService } from 'src/app/service/Backend/Api/TerminologyApi.service'
import { FilterProvider } from '../../Filter/SearchFilterProvider.service'

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaSearchEngineService {
  private readonly filterProvider = inject(FilterProvider)
  private readonly terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Search by bulk criteria.
   * @param {string} searchterms
   * @returns {Observable<CriteriaBulkResultList>}
   */
  public search(searchterms: string): Observable<CriteriaBulkResultList> {
    const body = this.createPostData(searchterms)
    return this.terminologyApiService
      .postTerminologyBulkSearch(body)
      .pipe(map((response: BulkSearchResponseData) => CriteriaBulkResultList.fromJson(response)))
  }

  /**
   * Returns the post data for bulk search.
   * @param {string} searchterms
   * @returns {BulkSearchPostData}
   */
  private createPostData(searchterms: string): BulkSearchPostData {
    const selectedTerminologies = this.getTerminologyFilter()
    const selectedContext = this.getContextFilter()
    const parsedSearchTerms = searchterms.split(/[\s,;]+/).filter(Boolean)
    return {
      searchterms: parsedSearchTerms,
      terminology: selectedTerminologies,
      context: selectedContext,
    }
  }

  /**
   * Returns the selected terminology filter as a comma-separated string.
   * @returns {string}
   */
  private getTerminologyFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.TERMINOLOGY).join(',')
  }

  /**
   * Rteturns the selected context filter as a comma-separated string.
   * @returns {string}
   */
  private getContextFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.CONTEXT).join(',')
  }
}
