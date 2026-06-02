import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'
import { distinctUntilChanged, filter, map } from 'rxjs/operators'
import { CriteriaSearchFilter } from 'src/app/model/Search/Filter/CriteriaSearchFilter'
import { FilterProvider } from './Filter/SearchFilterProvider.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaSearchStateService {
  private filterProvider = inject(FilterProvider)

  private searchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')
  private searchFilterSubject: Subject<CriteriaSearchFilter> = new Subject<CriteriaSearchFilter>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  public getActiveSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable()
  }

  public setActiveSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm)
  }

  public getActiveSearchFilter(): Observable<CriteriaSearchFilter> {
    return this.searchFilterSubject.asObservable()
  }

  public setActiveSearchFilter(searchFilter: CriteriaSearchFilter): void {
    this.searchFilterSubject.next(searchFilter)
  }

  /**
   * If the the current search term or the search filters change, this method will reset the pagination and clear the results.
   * It listens to changes in the search term and search filters, and emits true when either changes.
   */
  public searchChanged(): Observable<boolean> {
    const termChanges$ = this.searchTermChanges()
    const filterChanges$ = this.filterChanges()
    return combineLatest([termChanges$, filterChanges$]).pipe(
      map(([termChanged, filterChanged]) => termChanged || filterChanged)
    )
  }

  /**
   * Emits true when the active search term changes.
   */
  private searchTermChanges(): Observable<boolean> {
    return this.getActiveSearchTerm().pipe(
      distinctUntilChanged((prev, curr) => prev === curr),
      map(() => true)
    )
  }

  /**
   * Emits true when the search filters change.
   */
  private filterChanges(): Observable<boolean> {
    return this.filterProvider.getCriteriaSearchFilters().pipe(
      filter((filters: CriteriaSearchFilter[]) => filters.length > 0),
      map((filters) =>
        JSON.stringify(
          filters.map((f) => ({
            name: f.getName(),
            selected: [...f.getSelectedValues()],
          }))
        )
      ),
      distinctUntilChanged((prev, curr) => prev === curr),
      map(() => true)
    )
  }
}
