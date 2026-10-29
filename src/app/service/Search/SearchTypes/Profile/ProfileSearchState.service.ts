import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProfileSearchStateService {
  private readonly searchTermSubject = new BehaviorSubject<string>('')

  public getActiveSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable()
  }

  public setActiveSearchTerm(term: string): void {
    this.searchTermSubject.next(term)
  }
}
