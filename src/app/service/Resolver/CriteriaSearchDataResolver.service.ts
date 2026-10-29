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

  public resolve(): Observable<CriteriaResultList> {
    return this.searchService.search('').pipe()
  }
}
