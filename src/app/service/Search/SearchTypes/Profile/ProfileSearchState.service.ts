import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchStateService {
  private readonly searchTermSubject = new BehaviorSubject<string>('')

  /**
   * Returns the active search term.
   * @returns {Observable<string>}
   */
  public getActiveSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable()
  }

  /**
   * Sets the active search term.
   * @param {string} term
   */
  public setActiveSearchTerm(term: string): void {
    this.searchTermSubject.next(term)
  }
}
