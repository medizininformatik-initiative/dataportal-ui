import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'

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
