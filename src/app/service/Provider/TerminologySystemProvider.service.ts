import { Injectable, inject } from '@angular/core'
import { tap, map, catchError } from 'rxjs/operators'
import {
  CodeSystemEntry,
  TerminologySystemDictionary,
} from 'src/app/model/Utilities/TerminologySystemDictionary'
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TerminologySystemProvider {
  private terminologyApiService = inject(TerminologyApiService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public initializeTerminologySystems(): Observable<boolean> {
    return this.terminologyApiService.getTerminologySystems().pipe(
      tap((data: CodeSystemEntry[]) => {
        TerminologySystemDictionary.initialize(data)
      }),
      map(() => true),
      catchError(() => of(false))
    )
  }
}
