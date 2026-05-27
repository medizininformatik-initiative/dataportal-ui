import { CriteriaSearchResultProviderService } from '../SearchTypes/Criteria/Result/CriteriaSearchResultProvider.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated
 */
export class SearchResultProvider {
  private criteriaResultProvider = inject(CriteriaSearchResultProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public getCriteriaSearchResults(): Observable<CriteriaResultList | null> {
    return this.criteriaResultProvider.getSearchResults()
  }
}
