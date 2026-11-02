import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'

@Injectable({
  providedIn: 'root',
})
export class CriteriaEntryDetailsProviderService {
  private readonly searchTermDetailsSubject: BehaviorSubject<CriteriaEntryDetails | null> =
    new BehaviorSubject<CriteriaEntryDetails | null>(null)

  constructor() {}

  /**
   * Returns the criteria entry details as an observable.
   * @returns {Observable<CriteriaEntryDetails | null>}
   */
  public getCriteriaEntryDetails$(): Observable<CriteriaEntryDetails | null> {
    return this.searchTermDetailsSubject.asObservable()
  }

  /**
   * Sets the criteria entry details.
   * @param {CriteriaEntryDetails | null} details
   */
  public setCriteriaEntryDetails(details: CriteriaEntryDetails | null): void {
    this.searchTermDetailsSubject.next(details)
  }

  /**
   * Clears the criteria entry details.
   */
  public resetCriteriaEntryDetails(): void {
    this.searchTermDetailsSubject.next(null)
  }
}
