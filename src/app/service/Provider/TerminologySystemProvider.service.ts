import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service';
import { TerminologySystemData } from 'src/app/model/Interface/TerminologySystemData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';

@Injectable({
  providedIn: 'root',
})
export class TerminologySystemProvider {
  constructor(private terminologyApiService: TerminologyApiService) {}

  public initializeTerminologySystems(): Observable<boolean> {
    return this.terminologyApiService.getTerminologySystems().pipe(
      tap((data: TerminologySystemData[]) => {
        TerminologySystemDictionary.initialize(data);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
