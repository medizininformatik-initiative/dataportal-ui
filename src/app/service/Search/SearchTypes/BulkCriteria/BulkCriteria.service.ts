import { BulkCriteriaSearchEngineService } from './BulkCriteriaSearchEngine.service';
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaService {
  constructor(private bulkCriteriaSearchEngineService: BulkCriteriaSearchEngineService) {}

  public search(searchterms: string): Observable<CriteriaBulkResultList> {
    return this.bulkCriteriaSearchEngineService.search(searchterms);
  }
}
