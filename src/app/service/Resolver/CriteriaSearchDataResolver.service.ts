import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchService } from '../Search/SearchTypes/Criteria/CriteriaSearch.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchDataResolverService {
  private readonly searchService = inject(CriteriaSearchService)

  constructor() {}

  /**
   * Loads the criteria search results for an empty search term.
   * @returns {Observable<CriteriaResultList>}
   */
  public resolve(): Observable<CriteriaResultList> {
    return this.searchService.search('').pipe()
  }
}
