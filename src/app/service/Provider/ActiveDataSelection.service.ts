import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ActiveDataSelectionService {
  /**
   * BehaviorSubject that holds the state of the active FeasibilityQuery.
   * Initialized with `null` as the default value.
   */
  private readonly activeDataSelectionIDSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  /**
   * Observable of the active FeasibilityQueryID.
   * Use this to subscribe and get updates when the active FeasibilityQueryID changes.
   */
  public activeDataSelectionID$ = this.activeDataSelectionIDSubject.asObservable()
  private activeDataSelectionId: string

  constructor() {}

  /**
   * Getter method to retrieve the current value of the active FeasibilityQueryID.
   *
   * @returns {Observable<string> | null} The current active FeasibilityQueryID or null if not set.
   */
  public getActiveDataSelectionIdObservable(): Observable<string> | null {
    return this.activeDataSelectionIDSubject.asObservable()
  }

  /**
   * Setter method to update the active FeasibilityQueryID.
   *
   * @param {string} id - The FeasibilityQueryID instance to set as active.
   */
  public setActiveDataSelectionID(id: string): void {
    this.activeDataSelectionId = id
    this.activeDataSelectionIDSubject.next(id)
  }

  public getActiveDataSelectionId(): string {
    return this.activeDataSelectionId
  }
}
