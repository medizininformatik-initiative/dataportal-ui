import { computed, inject, Injectable, Signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionMainProfileProviderService } from '../../DataSelectionMainProfileProvider.service'
import { DataSelectionProviderService } from '../../Provider/DataSelectionProvider.service'
import { ProfileValidationService, ProfileValidationState } from './ProfileValidationService.service'

export { ProfileStateType, ProfileValidationState } from './ProfileValidationService.service'

export interface DataSelectionValidationState {
  profileCount: number
  isValid: boolean
  profileValidationStates: ProfileValidationState[]
}

const INITIAL_STATE: DataSelectionValidationState = {
  profileCount: 0,
  isValid: false,
  profileValidationStates: [],
}

@Injectable({ providedIn: 'root' })
export class DataSelectionValidationService {
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly mainProfileProviderService = inject(DataSelectionMainProfileProviderService)
  private readonly profileValidationService = inject(ProfileValidationService)

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProviderService.getActiveDataSelection().pipe(map((data) => data ?? null)),
    { initialValue: null, equal: () => false }
  )

  private readonly patientProfile = toSignal(this.mainProfileProviderService.getPatientProfile$(), {
    initialValue: null,
    equal: () => false,
  })

  public readonly validationState: Signal<DataSelectionValidationState> = computed(() => {
    const dataSelection = this.activeDataSelection()
    if (!dataSelection) {
      return INITIAL_STATE
    }

    const profiles = dataSelection.getProfiles()
    const containsMainProfile = profiles.some((p: DataSelectionProfile) => p.getUrl() === this.patientProfile()?.getUrl())
    if (!containsMainProfile) {
      return INITIAL_STATE
    }

    const profileValidationStates = this.profileValidationService.validateMany(profiles)
    return {
      profileCount: profileValidationStates.length,
      isValid: profileValidationStates.every((s: ProfileValidationState) => s.isValid),
      profileValidationStates,
    }
  })
}
