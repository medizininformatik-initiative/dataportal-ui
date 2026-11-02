import { Injectable } from '@angular/core'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { ProfileSearchFilter } from 'src/app/model/Search/Filter/ProfileSearchFilter'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchFilterProviderService {
  private readonly profileSearchFiltersSubject = new BehaviorSubject<ProfileSearchFilter[]>([])

  /**
   * Returns the profile search filters as an observable.
   * @returns {Observable<ProfileSearchFilter[]>}
   */
  public getProfileSearchFilters(): Observable<ProfileSearchFilter[]> {
    return this.profileSearchFiltersSubject.asObservable()
  }

  /**
   * Sets the profile search filters.
   * @param {ProfileSearchFilter[]} filters
   */
  public setProfileSearchFilters(filters: ProfileSearchFilter[]): void {
    this.profileSearchFiltersSubject.next(filters)
  }

  /**
   * Returns the current profile search filters.
   * @returns {ProfileSearchFilter[]}
   */
  public getProfileSearchFiltersValue(): ProfileSearchFilter[] {
    return this.profileSearchFiltersSubject.getValue()
  }

  /**
   * Sets the selected values of the filter with the given type.
   * @param {string} filterType
   * @param {string[]} selectedValues
   */
  public updateFilterSelectedValues(filterType: string, selectedValues: string[]): void {
    const normalizedFilterType = filterType.toLowerCase()
    const updatedFilters = this.profileSearchFiltersSubject.getValue().map((filter: ProfileSearchFilter) => {
      if (filter.getName().toLowerCase() !== normalizedFilterType) {
        return filter
      }

      filter.setSelectedValues(selectedValues)
      return filter
    })

    this.profileSearchFiltersSubject.next([...updatedFilters])
  }

  /**
   * Clears the selected values of all filters.
   */
  public resetSelectedValues(): void {
    const updatedFilters = this.profileSearchFiltersSubject.getValue().map((filter: ProfileSearchFilter) => {
      filter.setSelectedValues([])
      return filter
    })

    this.profileSearchFiltersSubject.next([...updatedFilters])
  }

  /**
   * Emits whether no filter has a selected value.
   * @returns {Observable<boolean>}
   */
  public filtersNotSet(): Observable<boolean> {
    return this.profileSearchFiltersSubject
      .asObservable()
      .pipe(
        map((filters: ProfileSearchFilter[]) => filters.every((filter: ProfileSearchFilter) => filter.getSelectedValues().length === 0))
      )
  }

  /**
   * Returns the selected modules.
   * @returns {Observable<string[]>}
   */
  public getSelectedModules(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.MODULE)
  }

  /**
   * Returns the selected categories.
   * @returns {Observable<string[]>}
   */
  public getSelectedCategories(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.CATEGORY)
  }

  /**
   * Returns the selected resource types.
   * @returns {Observable<string[]>}
   */
  public getSelectedResourceTypes(): Observable<string[]> {
    return this.getSelectedValuesOfType(ElasticSearchFilterTypes.RESOURCE_TYPE)
  }

  /**
   * Returns the selected values of the filter with the given type.
   * @param {string} filterType
   * @returns {Observable<string[]>}
   */
  private getSelectedValuesOfType(filterType: string): Observable<string[]> {
    return this.profileSearchFiltersSubject.asObservable().pipe(
      map((filters: ProfileSearchFilter[]) => {
        const filter = filters.find((item: ProfileSearchFilter) => item.getName().toLowerCase() === filterType.toLowerCase())
        return filter?.getSelectedValues() ?? []
      })
    )
  }
}
