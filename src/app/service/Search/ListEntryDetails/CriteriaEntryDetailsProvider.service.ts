import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'

@Injectable({
  providedIn: 'root',
})
export class CriteriaEntryDetailsProviderService {
  private searchTermDetailsSubject: BehaviorSubject<CriteriaEntryDetails | null> =
    new BehaviorSubject<CriteriaEntryDetails | null>(null)

  constructor() {}

  public getCriteriaEntryDetails$(): Observable<CriteriaEntryDetails | null> {
    return this.searchTermDetailsSubject.asObservable()
  }

  public setCriteriaEntryDetails(details: CriteriaEntryDetails | null) {
    this.searchTermDetailsSubject.next(details)
  }

  public resetCriteriaEntryDetails(): void {
    this.searchTermDetailsSubject.next(null)
  }
}
