import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { switchMap } from 'rxjs/operators'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProvidersInitService {
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly feasibilityQueryProvider = inject(FeasibilityQueryProviderService)
  private readonly dataSelectionMainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Initializes both DataSelectionProvider and FeasibilityQueryProvider.
   * Emits true only if both succeed.
   * @param {DataSelectionProfile} patientProfileResult
   * @returns {Observable<boolean>}
   */
  public initializeProviders(patientProfileResult: DataSelectionProfile): Observable<boolean> {
    this.dataSelectionMainProfileProviderService.setPatientProfile(patientProfileResult)
    return this.dataSelectionProvider
      .initDataSelection(patientProfileResult)
      .pipe(
        switchMap((dsResult: boolean) =>
          this.feasibilityQueryProvider.loadInitialQuery().pipe(map((fqResult: boolean) => dsResult && fqResult))
        )
      )
  }
}
