import { BulkCriteriaSearchEngineService } from './BulkCriteriaSearchEngine.service'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaService {
  private bulkCriteriaSearchEngineService = inject(BulkCriteriaSearchEngineService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public search(searchterms: string): Observable<CriteriaBulkResultList> {
    return this.bulkCriteriaSearchEngineService.search(searchterms)
  }
}
