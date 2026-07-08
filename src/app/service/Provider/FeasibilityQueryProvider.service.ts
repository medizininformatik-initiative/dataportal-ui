import { ActiveFeasibilityQueryService } from './ActiveFeasibilityQuery.service'
import { BehaviorSubject, filter, map, Observable, of, switchMap, tap } from 'rxjs'
import { FeasibilityQuery } from '../../model/FeasibilityQuery/FeasibilityQuery'
import { inject, Injectable } from '@angular/core'
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class FeasibilityQueryProviderService {
  private storage = inject<StorageService>(LOCAL_STORAGE)
  private activeFeasibilityQuery = inject(ActiveFeasibilityQueryService)

  private readonly STORAGE_QUERY_KEY = 'QUERY'
  private feasibilityQueryMap: Map<string, FeasibilityQuery> = new Map()
  private feasibilityQueryMapSubject: BehaviorSubject<Map<string, FeasibilityQuery>> =
    new BehaviorSubject(new Map())
  private hasQueryResult: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() {}

  /**
   * Loads the initial feasibility query from local storage.
   * If no query is stored, initializes with a default query.
   */
  public loadInitialQuery(): Observable<boolean> {
    const storedQuery = this.storage.get(this.STORAGE_QUERY_KEY)
    const uid = uuidv4()
    if (storedQuery && storedQuery.groups) {
      this.storage.remove(this.STORAGE_QUERY_KEY)
    }
    this.setFeasibilityQueryById(new FeasibilityQuery(uid), uid, true)
    return of(true)
  }

  /**
   * Sets the feasibility query and updates local storage.
   * @param id the uid to set
   * @param feasibilityQuery The new feasibility query to set
   * @param setAsActive Whether to set the query as the active query
   */
  public setFeasibilityQueryById(
    feasibilityQuery: FeasibilityQuery,
    id: string,
    setAsActive: boolean = false
  ): void {
    this.storage.set(this.STORAGE_QUERY_KEY, feasibilityQuery)
    this.feasibilityQueryMap.set(id, feasibilityQuery)
    this.feasibilityQueryMapSubject.next(new Map(this.feasibilityQueryMap))
    if (setAsActive) {
      this.activeFeasibilityQuery.setActiveFeasibilityQueryID(id)
    }
  }

  /**
   * Retrieves the current feasibility query as an observable.
   *
   * @returns Observable<Query>
   */
  public getFeasibilityQueryByID(id: string): Observable<FeasibilityQuery> {
    return this.feasibilityQueryMapSubject.pipe(
      filter((feasibilityQueryMap) => feasibilityQueryMap.has(id)),
      map((feasibilityQueryMap) => feasibilityQueryMap.get(id)!)
    )
  }

  public getActiveFeasibilityQuery(): Observable<FeasibilityQuery> {
    return this.activeFeasibilityQuery.getActiveFeasibilityQueryIdObservable().pipe(
      switchMap((id) =>
        this.feasibilityQueryMapSubject.pipe(
          filter((map) => map.has(id)),
          map((map) => map.get(id)!)
        )
      )
    )
  }
  /**
   * Retrieves the current feasibility query map as an observable.
   *
   * @returns Observable<Query>
   */
  public getFeasibilityQueryMap(): Observable<Map<string, FeasibilityQuery>> {
    return this.feasibilityQueryMapSubject.asObservable()
  }

  /**
   * Resets the feasibility query to the default query and updates local storage.
   */
  public resetToDefaultQuery(): void {
    this.storage.clear()
  }

  /**
   * Sets the inclusion criteria for the active feasibility query.
   * @param {string[][]} criteria
   */
  public setInclusionCriteria(criteria: string[][]): void {
    const id = this.activeFeasibilityQuery.getActiveFeasibilityQueryID()

    const oldQuery = this.feasibilityQueryMap.get(id)!
    const newQuery = oldQuery.clone()

    newQuery.setInclusionCriteria(criteria)

    this.feasibilityQueryMap.set(id, newQuery)
    this.feasibilityQueryMapSubject.next(new Map(this.feasibilityQueryMap))
  }

  /**
   * Sets the exclusion criteria for the active feasibility query.
   * @param {string[][]} criteria
   */
  public setExclusionCriteria(criteria: string[][]): void {
    const id = this.activeFeasibilityQuery.getActiveFeasibilityQueryID()

    const oldQuery = this.feasibilityQueryMap.get(id)!
    const newQuery = oldQuery.clone()
    newQuery.setExclusionCriteria(criteria)
    this.feasibilityQueryMap.set(id, newQuery)
    this.feasibilityQueryMapSubject.next(new Map(this.feasibilityQueryMap))
  }

  /**
   * Deletes a criterion from the inclusion criteria of the active feasibility query.
   * @param {string} id - The ID of the criterion to delete.
   */
  public deleteFromInclusion(id: string): void {
    const feasibilityQuery = this.feasibilityQueryMap.get(
      this.activeFeasibilityQuery.getActiveFeasibilityQueryID()
    )
    if (feasibilityQuery) {
      const criteria = this.deleteCriterion(feasibilityQuery.getInclusionCriteria(), id)
      this.setInclusionCriteria(criteria)
    }
  }

  /**
   * Deletes a criterion from the exclusion criteria of the active feasibility query.
   * @param {string} id - The ID of the criterion to delete.
   */
  public deleteFromExclusion(id: string): void {
    const feasibilityQuery = this.feasibilityQueryMap.get(
      this.activeFeasibilityQuery.getActiveFeasibilityQueryID()
    )
    if (feasibilityQuery) {
      const criteria = this.deleteCriterion(feasibilityQuery.getExclusionCriteria(), id)
      this.setExclusionCriteria(criteria)
    }
  }

  /**
   * Deletes a criterion from the given criteria array.
   * @param {string[][]} inexclusion - The array of criteria arrays.
   * @param {string} criterionID - The ID of the criterion to delete.
   * @returns {string[][]} - The updated array of criteria arrays.
   */
  private deleteCriterion(inexclusion: string[][], criterionID: string): string[][] {
    inexclusion.forEach((idArray) => {
      const index = idArray.indexOf(criterionID)
      if (index > -1) {
        idArray.splice(index, 1)
      }
    })
    inexclusion = inexclusion.filter((item) => item.length > 0)
    return inexclusion
  }

  /**
   *
   * @returns {Observable<boolean>}
   */
  public getHasQueryResult(): Observable<boolean> {
    return this.hasQueryResult.asObservable()
  }

  /**
   * Clears the current feasibility query and resets it to the initial state.
   * @returns {void}
   */
  public clearFeasibilityQuery(): void {
    this.loadInitialQuery()
  }
}
