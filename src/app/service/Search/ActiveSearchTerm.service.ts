import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service for managing the currently active search terms across the application.
 * Maintains state for both general search terms and criteria-specific search terms
 * using reactive streams for component communication.
 */
@Injectable({
  providedIn: 'root',
})
export class ActiveSearchTermService {
  /**
   * Subject for tracking the general active search term.
   * @private
   */
  private readonly activeSearchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')

  /**
   * Subject for tracking the criteria-specific active search term.
   * @private
   */
  private readonly activeCriteriaSearchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')

  /**
   * Gets an observable stream of the currently active general search term.
   *
   * @returns {Observable<string>} Observable that emits the currently active search term, defaults to empty string
   */
  public getActiveSearchTerm(): Observable<string> {
    return this.activeSearchTermSubject.asObservable()
  }

  /**
   * Sets the currently active general search term.
   *
   * @param {string} searchText - The search term to set as active
   */
  public setActiveSearchTerm(searchText: string): void {
    this.activeSearchTermSubject.next(searchText)
  }

  /**
   * Gets an observable stream of the currently active criteria search term.
   *
   * @returns {Observable<string>} Observable that emits the currently active criteria search term, defaults to empty string
   */
  public getActiveCriteriaSearchTerm(): Observable<string> {
    return this.activeCriteriaSearchTermSubject.asObservable()
  }

  /**
   * Sets the currently active criteria search term.
   *
   * @param {string} searchText - The criteria search term to set as active
   */
  public setActiveCriteriaSearchTerm(searchText: string) {
    this.activeCriteriaSearchTermSubject.next(searchText)
  }
}
