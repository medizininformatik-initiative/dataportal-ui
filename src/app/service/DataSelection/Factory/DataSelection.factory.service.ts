import { DataSelection } from 'src/app/model/DataSelection/DataSelection'
import { DataSelectionMainProfileInitializerService } from '../../DataSelectionMainProfileInitializerService'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { Injectable, inject } from '@angular/core'
import { map, Observable, take } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
/**
 * Factory service to create a `DataSelection` instance.
 * Creates a new selection, sets the provider, and attaches the main profile.
 */
export class DataSelectionFactoryService {
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private dataSelectionMainProfileInitializerService = inject(
    DataSelectionMainProfileInitializerService
  )

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public instantiate(): Observable<DataSelection> {
    return this.loadMainProfile().pipe(
      map((mainProfile: DataSelectionProfile) => {
        const dataSelection = this.setProfileInDataSelection(mainProfile)
        this.setDataSelectionProvider(dataSelection)
        return dataSelection
      })
    )
  }

  private setDataSelectionProvider(dataSelection: DataSelection): void {
    this.dataSelectionProviderService.setDataSelectionByUID(
      dataSelection.getId(),
      dataSelection,
      true
    )
  }

  private loadMainProfile() {
    return this.dataSelectionMainProfileInitializerService.initializePatientProfile()
  }

  private setProfileInDataSelection(mainProfile: DataSelectionProfile): DataSelection {
    const dataSelection = new DataSelection([], uuidv4())
    dataSelection.setProfiles([mainProfile])
    return dataSelection
  }
}
