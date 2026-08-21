import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { SearchFilterData } from 'src/app/model/Interface/Search/Filter/SearchFilterData'
import { SearchFilterValueData } from 'src/app/model/Interface/Search/Filter/SearchFilterValueData'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchFilterService {
  private terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches available filters from the backend and updates the filters subject.
   * @returns An Observable emitting the current list of filters.
   */
  public fetchFilters(url: string): Observable<Array<CriteriaSearchFilter>> {
    return this.terminologyApiService
      .getSearchFilter(url)
      .pipe(
        map((response: SearchFilterData[]) =>
          response
            .filter((filter: SearchFilterData) => filter.values && filter.values.length > 0)
            .map((filter: SearchFilterData) => this.createSearchTermFilter(filter))
        )
      )
  }

  /**
   * Creates a CriteriaSearchFilter from CriteriaSearchFilterData.
   * @param filter
   * @returns
   */
  private createSearchTermFilter(filter: SearchFilterData): CriteriaSearchFilter {
    const searchTermValues = this.buildSearchTermValues(filter.values)
    const filterType = this.setFilterType(filter.name)
    return new CriteriaSearchFilter(filterType, searchTermValues)
  }

  /**
   * Maps SearchFilterData to CriteriaSearchFilterValue.
   * @param values
   * @returns
   */
  private buildSearchTermValues(values: SearchFilterValueData[]): CriteriaSearchFilterValue[] {
    return values.map(
      (value: SearchFilterValueData) => new CriteriaSearchFilterValue(value.count, value.label)
    )
  }

  private setFilterType(name: string): ElasticSearchFilterTypes {
    return ElasticSearchFilterTypes[name.toUpperCase() as keyof typeof ElasticSearchFilterTypes]
  }
}
