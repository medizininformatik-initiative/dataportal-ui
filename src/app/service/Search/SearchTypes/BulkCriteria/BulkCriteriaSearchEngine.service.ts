import { BulkSearchPostData } from 'src/app/model/Interface/BulkSearchPostData'
import { BulkSearchResponseData } from 'src/app/model/Interface/BulkSearchResponseData'
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterProvider } from '../../Filter/SearchFilterProvider.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { TerminologyApiService } from 'src/app/service/Backend/Api/TerminologyApi.service'

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaSearchEngineService {
  private filterProvider = inject(FilterProvider)
  private terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Search by bulk criteria.
   * @param searchterms
   * @returns
   */
  public search(searchterms: string): Observable<CriteriaBulkResultList> {
    const body = this.createPostData(searchterms)
    return this.terminologyApiService.postTerminologyBulkSearch(body).pipe(
      map((response: BulkSearchResponseData) => {
        const result = CriteriaBulkResultList.fromJson(response)
        result.setFound(this.sortByInputOrder(result.getFound(), body.searchterms))
        return result
      })
    )
  }

  /**
   * Orders found entries like the codes were entered, so the first code names the criterium.
   * Entries whose code is not in the input keep their relative order at the end (stable sort).
   */
  private sortByInputOrder(
    entries: CriteriaBulkEntry[],
    searchterms: string[]
  ): CriteriaBulkEntry[] {
    const position = (entry: CriteriaBulkEntry): number => {
      const index = searchterms.indexOf(entry.getTermCodes()[0]?.getCode())
      return index === -1 ? searchterms.length : index
    }
    return [...entries].sort((a, b) => position(a) - position(b))
  }

  /**
   * Returns the post data for bulk search.
   * @param searchterms
   * @returns
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
   * @returns
   */
  private getTerminologyFilter(): string {
    return this.filterProvider
      .getSelectedValuesOfType(ElasticSearchFilterTypes.TERMINOLOGY)
      .join(',')
  }

  /**
   * Rteturns the selected context filter as a comma-separated string.
   * @returns
   */
  private getContextFilter(): string {
    return this.filterProvider.getSelectedValuesOfType(ElasticSearchFilterTypes.CONTEXT).join(',')
  }
}
