import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchService } from '../Search/SearchTypes/Criteria/CriteriaSearch.service'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchDataResolverService {
  private searchService = inject(CriteriaSearchService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public resolve(): Observable<CriteriaResultList> {
    return this.searchService.search('').pipe()
  }
}
