import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { SearchFilterData } from 'src/app/model/Interface/Search/Filter/SearchFilterData'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterService {
  private readonly dataSelectionApiService = inject(DataSelectionApiService)

  constructor() {}

  /**
   * Fetches the profile search filters.
   * @param {string} url
   * @returns {Observable<ProfileSearchFilter[]>}
   */
  public fetchFilter(url?: string): Observable<ProfileSearchFilter[]> {
    return this.dataSelectionApiService.getProfileSearchFilter(url).pipe(map((filter) => this.mapFilters(filter)))
  }

  /**
   * Maps the filter data to profile search filters.
   * @param {SearchFilterData | SearchFilterData[]} filter
   * @returns {ProfileSearchFilter[]}
   */
  private mapFilters(filter: SearchFilterData | SearchFilterData[]): ProfileSearchFilter[] {
    if (Array.isArray(filter)) {
      return filter.map((item: SearchFilterData) => ProfileSearchFilter.fromJson(item))
    }

    return [ProfileSearchFilter.fromJson(filter)]
  }
}
