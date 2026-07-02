import { computed, inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionValidationService {
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly mainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProviderService.getActiveDataSelection(),
    { initialValue: null }
  )

  private readonly patientProfile = toSignal(this.mainProfileProviderService.getPatientProfile$(), {
    initialValue: null,
  })

  readonly isDataSelectionValid = computed(() => {
    const dataSelection = this.activeDataSelection()
    const patientProfile = this.patientProfile()
    if (!dataSelection || !patientProfile) {
      return false
    }
    return (
      this.validateProfiles(dataSelection.getProfiles()) && this.validateProfile(patientProfile)
    )
  })

  private validateProfiles(profiles: DataSelectionProfile[]): boolean {
    return profiles.every((profile: DataSelectionProfile) => this.validateProfile(profile))
  }

  private validateProfile(profile: DataSelectionProfile): boolean {
    const fieldsSet = profile.getProfileFields().getSelectedBasicFields().length > 0
    const recommendedReferencesSet =
      profile.getProfileFields().getUnlinkedRequiredOrRecommendedReferences().length === 0
    const validationResult = fieldsSet && recommendedReferencesSet
    return validationResult
  }
}
