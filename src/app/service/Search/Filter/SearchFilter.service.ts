import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { CriteriaSearchFilterData } from 'src/app/model/Interface/Search/CriteriaSearchFilterData'
import { CriteriaSearchFilterValue } from 'src/app/model/Search/Filter/CriteriaSearchFilterValue'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SearchFilterData } from 'src/app/model/Interface/Search/SearchFilterData'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'

@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  private backendService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Fetches available filters from the backend and updates the filters subject.
   * @returns An Observable emitting the current list of filters.
   */
  public fetchFilters(url: string): Observable<Array<CriteriaSearchFilter>> {
    return this.backendService
      .getSearchFilter(url)
      .pipe(
        map((response: CriteriaSearchFilterData[]) =>
          response
            .filter((filter: CriteriaSearchFilterData) => filter.values && filter.values.length > 0)
            .map((filter: CriteriaSearchFilterData) => this.createSearchTermFilter(filter))
        )
      )
  }

  /**
   * Creates a CriteriaSearchFilter from CriteriaSearchFilterData.
   * @param filter
   * @returns
   */
  private createSearchTermFilter(filter: CriteriaSearchFilterData): CriteriaSearchFilter {
    const searchTermValues = this.buildSearchTermValues(filter.values)
    const filterType = this.setFilterType(filter.name)
    return new CriteriaSearchFilter(filterType, searchTermValues)
  }

  /**
   * Maps SearchFilterData to CriteriaSearchFilterValue.
   * @param values
   * @returns
   */
  private buildSearchTermValues(values: SearchFilterData[]): CriteriaSearchFilterValue[] {
    return values.map(
      (value: SearchFilterData) => new CriteriaSearchFilterValue(value.count, value.label)
    )
  }

  private setFilterType(name: string): ElasticSearchFilterTypes {
    return ElasticSearchFilterTypes[name.toUpperCase() as keyof typeof ElasticSearchFilterTypes]
  }
}
