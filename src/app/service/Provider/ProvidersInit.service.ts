import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ProvidersInitService {
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)
  private dataSelectionMainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initializes both DataSelectionProvider and FeasibilityQueryProvider.
   * Emits true only if both succeed.
   */
  public initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    this.dataSelectionMainProfileProviderService.setPatientProfile(patientProfileResult)
    return this.dataSelectionProvider
      .initDataSelection(patientProfileResult)
      .pipe(
        switchMap((dsResult) =>
          this.feasibilityQueryProvider
            .loadInitialQuery()
            .pipe(map((fqResult) => dsResult && fqResult))
        )
      )
  }
}
