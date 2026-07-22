import { inject, Injectable } from '@angular/core'
import { DataSelectionApiService } from '../../Backend/Api/DataSelectionApi.service'
import { filter, map, Observable, tap } from 'rxjs'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterService {
  private dataSelectionApiService = inject(DataSelectionApiService)

  constructor() {}

  public fetchFilter(): Observable<any> {
    return this.dataSelectionApiService.getProfileSearchFilter().pipe(
      //filter((searchFilter) => searchFilter.name === 'module'),
      map((filter) => this.mapFilter(filter)),
      tap((filter) => console.log(filter))
    )
  }

  private mapFilter(filter: any) {
    console.log(filter)
    return ProfileSearchFilter.fromJson(filter[0])
  }
}
