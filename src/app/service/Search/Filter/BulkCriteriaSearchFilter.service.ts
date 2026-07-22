import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { CriteriaSearchFilterAdapter } from 'src/app/shared/models/SearchFilter/CriteriaSearchFilterAdapter'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'
import { FilterProvider } from './SearchFilterProvider.service'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'

/**
 * Service for managing and filtering bulk criteria search filters.
 * Processes criteria search filters to keep only context and terminology filters,
 * removes patient values, and converts them to UI models.
 */
@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaSearchFilterService {
  private searchFilterProvider = inject(FilterProvider)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  /**
   * @param searchFilterProvider - Service for providing criteria search filters
   */
  constructor() {}

  /**
   * Retrieves and processes criteria search filters.
   * Filters for context and terminology types, removes patient values,
   * and converts to UI-compatible format.
   * @returns Observable that emits an array of SearchFilter objects
   */
  public getFilter(): Observable<SearchFilterData[]> {
    return this.searchFilterProvider.getCriteriaSearchFilters().pipe(
      map((filters: CriteriaSearchFilter[]) => this.keepContextAndTerminologyFilters(filters)),
      map((filters: CriteriaSearchFilter[]) => this.removePatientFromFilterValues(filters)),
      map((filters: CriteriaSearchFilter[]) => this.convertFiltersToUiModels(filters))
    )
  }

  /**
   * Filters the criteria search filters to keep only context and terminology filters.
   * @param filters - Array of CriteriaSearchFilter objects
   * @returns Filtered array containing only context and terminology filters
   */
  private keepContextAndTerminologyFilters(
    filters: CriteriaSearchFilter[]
  ): CriteriaSearchFilter[] {
    return filters.filter(
      (filter) =>
        filter.getName() === ElasticSearchFilterTypes.CONTEXT ||
        filter.getName() === ElasticSearchFilterTypes.TERMINOLOGY
    )
  }

  /**
   * Removes 'Patient' values from all filter values.
   * @param filters - Array of CriteriaSearchFilter objects
   * @returns Array of filters with patient values removed
   */
  private removePatientFromFilterValues(filters: CriteriaSearchFilter[]): CriteriaSearchFilter[] {
    return filters.map((filter) => {
      const updatedValues = filter.getValues().filter((value) => value.getLabel() !== 'Patient')
      filter.setValues(updatedValues)
      return filter
    })
  }

  /**
   * Converts CriteriaSearchFilter objects to UI-compatible SearchFilter models.
   * @param filters - Array of CriteriaSearchFilter objects
   * @returns Array of SearchFilter objects for UI consumption
   */
  private convertFiltersToUiModels(filters: CriteriaSearchFilter[]): SearchFilterData[] {
    return filters.map((filter) => CriteriaSearchFilterAdapter.convertToFilterValues(filter))
  }
}
