import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProvidersInitService {
  constructor(
    private dataSelectionProvider: DataSelectionProviderService,
    private feasibilityQueryProvider: FeasibilityQueryProviderService,
    private dataSelectionMainProfileProviderService: DataSelectionMainProfileProviderService
  ) {}

  /**
   * Initializes both DataSelectionProvider and FeasibilityQueryProvider.
   * Emits true only if both succeed.
   */
  public initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    this.dataSelectionMainProfileProviderService.setPatientProfile(patientProfileResult);
    return this.dataSelectionProvider
      .initializeDataSelectionInstance(patientProfileResult)
      .pipe(
        switchMap((dsResult) =>
          this.feasibilityQueryProvider
            .loadInitialQuery()
            .pipe(map((fqResult) => dsResult && fqResult))
        )
      );
  }
}
