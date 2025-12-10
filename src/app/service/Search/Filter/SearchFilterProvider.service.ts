import { BehaviorSubject, map, Observable } from 'rxjs';
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter';
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterProvider {
  private criteriaSearchFiltersSubject = new BehaviorSubject<CriteriaSearchFilter[]>([]);

  /**
   * Gets the current list of CriteriaSearchFilter objects as an Observable.
   *
   * @returns An Observable emitting the current list of CriteriaSearchFilter objects.
   */
  public getCriteriaSearchFilters(): Observable<CriteriaSearchFilter[]> {
    return this.criteriaSearchFiltersSubject.asObservable();
  }

  /**
   * Sets the list of CriteriaSearchFilter objects and updates the BehaviorSubject.
   *
   * @param filters An array of CriteriaSearchFilter objects to set.
   */
  public setCriteriaSearchFilters(filters: CriteriaSearchFilter[]): void {
    this.criteriaSearchFiltersSubject.next(filters);
  }

  /**
   * Gets selected values for a specific filter type.
   *
   * @param type The type of the filter to retrieve selected values for.
   * @returns An array of selected values for the specified filter type, or an empty array if the filter is not found.
   */
  public getSelectedValuesOfType(type: ElasticSearchFilterTypes): string[] {
    const filters = this.criteriaSearchFiltersSubject.getValue();
    const filter = filters.find((f) => f.getName() === type);
    return filter ? filter.getSelectedValues() : [];
  }

  /**
   * Emits `true` if any filters have selected values, otherwise `false`.
   */
  public filtersNotSet(): Observable<boolean> {
    return this.criteriaSearchFiltersSubject
      .asObservable()
      .pipe(map((filters) => filters.every((filter) => filter.getSelectedValues().length === 0)));
  }

  /**
   * Resets all selected values for all filters.
   */
  public resetSelectedValues(): void {
    const updatedFilters = this.criteriaSearchFiltersSubject.getValue().map((filter) => {
      filter.setSelectedValues([]);
      return filter;
    });
    this.criteriaSearchFiltersSubject.next(updatedFilters);
  }

  /**
   * Initializes the filter map with the given array of CriteriaSearchFilter objects.
   *
   * @param filters An array of CriteriaSearchFilter objects to initialize the map with.
   */
  public initializeFilterMap(filters: CriteriaSearchFilter[]): void {
    this.setCriteriaSearchFilters(filters);
  }

  /**
   * Updates an existing CriteriaSearchFilter in the list.
   * If the filter does not exist, it will not be added.
   *
   * @param updatedFilter The updated CriteriaSearchFilter object.
   */
  public updateCriteriaSearchFilter(updatedFilter: CriteriaSearchFilter): void {
    const filters = this.criteriaSearchFiltersSubject.getValue();
    const index = filters.findIndex((filter) => filter.getName() === updatedFilter.getName());

    if (index !== -1) {
      filters[index] = updatedFilter;
      this.criteriaSearchFiltersSubject.next([...filters]);
    }
  }

  /**
   * Updates the selected values of a specific filter.
   *
   * @param filterType The type of the filter to update.
   * @param selectedValues The new selected values to set.
   */
  public updateFilterSelectedValues(
    filterType: ElasticSearchFilterTypes,
    selectedValues: string[]
  ): void {
    const filters = this.criteriaSearchFiltersSubject.getValue();
    const filter = filters.find(
      (f) => f.getName() === (filterType.toLocaleLowerCase() as ElasticSearchFilterTypes)
    );
    if (filter) {
      filter.setSelectedValues(selectedValues);
      this.criteriaSearchFiltersSubject.next([...filters]);
    }
  }
}
