import { BehaviorSubject, map, Observable } from 'rxjs'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { Injectable } from '@angular/core'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterProviderService {
  private readonly profileSearchFiltersSubject = new BehaviorSubject<ProfileSearchFilter[]>([])

  public getProfileSearchFilters(): Observable<ProfileSearchFilter[]> {
    return this.profileSearchFiltersSubject.asObservable()
  }

  public setProfileSearchFilters(filters: ProfileSearchFilter[]): void {
    this.profileSearchFiltersSubject.next(filters)
  }

  public getProfileSearchFiltersValue(): ProfileSearchFilter[] {
    return this.profileSearchFiltersSubject.getValue()
  }

  public updateFilterSelectedValues(filterType: string, selectedValues: string[]): void {
    const normalizedFilterType = filterType.toLowerCase()
    const updatedFilters = this.profileSearchFiltersSubject.getValue().map((filter) => {
      if (filter.getName().toLowerCase() !== normalizedFilterType) {
        return filter
      }

      filter.setSelectedValues(selectedValues)
      return filter
    })

    this.profileSearchFiltersSubject.next([...updatedFilters])
  }

  public resetSelectedValues(): void {
    const updatedFilters = this.profileSearchFiltersSubject.getValue().map((filter) => {
      filter.setSelectedValues([])
      return filter
    })

    this.profileSearchFiltersSubject.next([...updatedFilters])
  }

  public filtersNotSet(): Observable<boolean> {
    return this.profileSearchFiltersSubject
      .asObservable()
      .pipe(map((filters) => filters.every((filter) => filter.getSelectedValues().length === 0)))
  }

  public getSelectedModules(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.MODULE)
  }

  public getSelectedCategories(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.CATEGORY)
  }

  public getSelectedResourceTypes(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.RESOURCE_TYPE)
  }

  private getSelectedValuesOfType(filterType: string): Observable<string[]> {
    return this.profileSearchFiltersSubject.asObservable().pipe(
      map((filters) => {
        const filter = filters.find(
          (item) => item.getName().toLowerCase() === filterType.toLowerCase()
        )
        return filter?.getSelectedValues() ?? []
      })
    )
  }
}
