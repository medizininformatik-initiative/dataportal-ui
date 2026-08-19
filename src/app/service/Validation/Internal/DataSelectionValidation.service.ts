import { computed, inject, Injectable, Signal } from '@angular/core'
import { DataSelectionMainProfileProviderService } from '../../DataSelectionMainProfileProvider.service'
import {
  ProfileValidationService,
  ProfileValidationState,
} from './ProfileValidationService.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { DataSelectionProviderService } from '../../Provider/DataSelectionProvider.service'

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
    this.dataSelectionProviderService.getActiveDataSelection(),
    { initialValue: null, equal: () => false }
  )

  private readonly patientProfile = toSignal(this.mainProfileProviderService.getPatientProfile$(), {
    initialValue: null,
    equal: () => false,
  })

  readonly validationState: Signal<DataSelectionValidationState> = computed(() => {
    const dataSelection = this.activeDataSelection()
    if (!dataSelection) {
      return INITIAL_STATE
    }

    const profiles = dataSelection.getProfiles()
    const containsMainProfile = profiles.some((p) => p.getId() === this.patientProfile()?.getId())
    if (!containsMainProfile) {
      return INITIAL_STATE
    }

    const profileValidationStates = this.profileValidationService.validateMany(profiles)
    return {
      profileCount: profileValidationStates.length,
      isValid: profileValidationStates.every((s) => s.isValid),
      profileValidationStates,
    }
  })
}
