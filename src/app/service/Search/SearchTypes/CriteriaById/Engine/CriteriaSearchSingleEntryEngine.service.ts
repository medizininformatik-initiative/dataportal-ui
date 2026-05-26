import { CriteriaResulByIdMapperStrategy } from '../Mapping/CriteriaResulByIdMapperStrategy'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchResultProviderService } from '../../Criteria/Result/CriteriaSearchResultProvider.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { TerminologyApiService } from 'src/app/service/Backend/Api/TerminologyApi.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchSigleEntryEngineService {
  private criteriaResultProvider = inject(CriteriaSearchResultProviderService)
  private terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public search(id: string): Observable<CriteriaResultList> {
    const mapping = this.getMapping()
    return this.terminologyApiService.getEntryById(id).pipe(
      map((result) => {
        this.criteriaResultProvider.setSearchResults(mapping.mapResponseToResultList(result))
        return mapping.mapResponseToResultList(result)
      })
    )
  }

  protected getMapping(): CriteriaResulByIdMapperStrategy {
    return new CriteriaResulByIdMapperStrategy()
  }
}
