import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { TerminologyApiService } from 'src/app/service/Backend/Api/TerminologyApi.service'
import { CriteriaSearchResultProviderService } from '../../Criteria/Result/CriteriaSearchResultProvider.service'
import { CriteriaResulByIdMapperStrategy } from '../Mapping/CriteriaResulByIdMapperStrategy'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchSigleEntryEngineService {
  private readonly criteriaResultProvider = inject(CriteriaSearchResultProviderService)
  private readonly terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches the criteria entry with the given id and maps it to a result list.
   * @param {string} id
   * @returns {Observable<CriteriaResultList>}
   */
  public search(id: string): Observable<CriteriaResultList> {
    const mapping = this.getMapping()
    return this.terminologyApiService.getEntryById(id).pipe(
      map((result: CriteriaListEntryData) => {
        this.criteriaResultProvider.setSearchResults(mapping.mapResponseToResultList(result))
        return mapping.mapResponseToResultList(result)
      })
    )
  }

  /**
   * Returns the mapper for the search results.
   * @returns {CriteriaResulByIdMapperStrategy}
   */
  protected getMapping(): CriteriaResulByIdMapperStrategy {
    return new CriteriaResulByIdMapperStrategy()
  }
}
