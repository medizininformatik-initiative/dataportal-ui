import { inject, Injectable } from '@angular/core'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'
import { map, Observable } from 'rxjs'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { SearchFilterData } from 'src/app/model/Interface/Search/Filter/SearchFilterData'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterService {
  private dataSelectionApiService = inject(DataSelectionApiService)

  constructor() {}

  public fetchFilter(url?: string): Observable<ProfileSearchFilter[]> {
    return this.dataSelectionApiService
      .getProfileSearchFilter(url)
      .pipe(map((filter) => this.mapFilters(filter)))
  }

  private mapFilters(filter: SearchFilterData | SearchFilterData[]): ProfileSearchFilter[] {
    if (Array.isArray(filter)) {
      return filter.map((item) => ProfileSearchFilter.fromJson(item))
    }

    return [ProfileSearchFilter.fromJson(filter)]
  }
}
