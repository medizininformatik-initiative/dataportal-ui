import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class ActiveFeasibilityQueryService {
  /**
   * BehaviorSubject that holds the state of the active FeasibilityQuery.
   * Initialized with a new UUID as the default value.
   */
  private activeFeasibilityQueryIDSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    uuidv4()
  )

  /**
   * Observable of the active FeasibilityQueryID.
   * Use this to subscribe and get updates when the active FeasibilityQueryID changes.
   */
  public activeFeasibilityIDQuery$ = this.activeFeasibilityQueryIDSubject.asObservable()
  private activeFeasibilityQueryID: string = uuidv4()

  constructor() {}

  /**
   * Getter method to retrieve the current value of the active FeasibilityQueryID.
   *
   * @returns The current active FeasibilityQueryID.
   */
  public getActiveFeasibilityQueryIdObservable(): Observable<string> {
    return this.activeFeasibilityQueryIDSubject.asObservable()
  }

  public getActiveFeasibilityQueryID(): string {
    return this.activeFeasibilityQueryID
  }
  /**
   * Setter method to update the active FeasibilityQueryID.
   *
   * @param queryID - The FeasibilityQueryID instance to set as active.
   */
  public setActiveFeasibilityQueryID(queryID: string): void {
    this.activeFeasibilityQueryID = queryID
    this.activeFeasibilityQueryIDSubject.next(queryID)
  }
}
