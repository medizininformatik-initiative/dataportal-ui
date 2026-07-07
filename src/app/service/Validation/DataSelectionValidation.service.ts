import { computed, inject, Injectable, Signal } from '@angular/core'
import { DataSelectionMainProfileProviderService } from '../DataSelectionMainProfileProvider.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'

export enum ValidationStateType {
  BasicFieldsSetButReferenceNotSet,
  BasicFieldsSetAndReferenceSet,
  NoBasicFieldsSetButReferencesSet,
  NoBasicFieldsSetAndNoReferencesSet,
}

export interface ProfileValidationState {
  isValid: boolean
  state: ValidationStateType
  referenceFieldIds?: string[]
  profileId: string
}
export interface DataSelectionValidationState {
  count: number
  isValid: boolean
  validatedProfiles: ProfileValidationState[]
}
@Injectable({
  providedIn: 'root',
})
export class DataSelectionValidationService {
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly mainProfileProviderService = inject(DataSelectionMainProfileProviderService)

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProviderService.getActiveDataSelection(),
    { initialValue: null, equal: () => false }
  )

  private readonly patientProfile = toSignal(this.mainProfileProviderService.getPatientProfile$(), {
    initialValue: null,
    equal: () => false,
  })

  /**
   * @returns {boolean} true if the active data selection is valid, false otherwise.
   */
  readonly validationState: Signal<DataSelectionValidationState> = computed(() => {
    const dataSelection = this.activeDataSelection()
    const containsMainProfile = dataSelection
      ?.getProfiles()
      .findIndex((profile) => profile.getId() === this.patientProfile()?.getId())

    if (containsMainProfile === -1 || !dataSelection) {
      return { isValid: false, count: 0, validatedProfiles: [] }
    }
    const validateProfiles = this.validateProfiles(dataSelection.getProfiles())
    const isValid = validateProfiles.every((context) => context.isValid)
    const count = validateProfiles.length
    return { isValid, count, validatedProfiles: validateProfiles }
  })

  constructor() {}

  private validateProfiles(profiles: DataSelectionProfile[]): ProfileValidationState[] {
    return profiles.map((profile: DataSelectionProfile) => {
      const validationState = this.validateProfile(profile)
      return {
        ...validationState,
        profileId: profile.getId(),
      }
    })
  }

  /**
   * Validates a single profile by checking if all required fields and recommended references are set.
   * @param {DataSelectionProfile} profile
   * @returns {boolean}
   *	1: `true` if at least one basic field is selected and no unlinked required or recommended references are present.
   *	2: `true` if no basic fields are selected and no unlinked required or recommended references are present.
   *	3: `false` if basic fields are selected, but there are unlinked required or recommended reference fields.
   *	4: `false` if neither basic fields but there are unlinked required or recommended reference fields.
   */
  public validateProfile(profile: DataSelectionProfile): ProfileValidationState {
    const hasUnlinkedReferences =
      profile.getProfileFields().getUnlinkedRequiredOrRecommendedReferences().length > 0

    const basicFieldsSet = profile.getProfileFields().getSelectedBasicFields().length > 0

    const referenceFieldsSet = profile.getProfileFields().getSelectedReferenceFields().length > 0

    if (basicFieldsSet && hasUnlinkedReferences) {
      return {
        isValid: false,
        state: ValidationStateType.BasicFieldsSetButReferenceNotSet,
        referenceFieldIds: profile
          .getProfileFields()
          .getUnlinkedRequiredOrRecommendedReferences()
          .map((field) => field.getElementId()),
        profileId: profile.getId(),
      }
    }

    if (basicFieldsSet) {
      return {
        isValid: true,
        state: ValidationStateType.BasicFieldsSetAndReferenceSet,
        profileId: profile.getId(),
      }
    }

    if (referenceFieldsSet) {
      return {
        isValid: true,
        state: ValidationStateType.NoBasicFieldsSetButReferencesSet,
        profileId: profile.getId(),
      }
    }

    return {
      isValid: false,
      state: ValidationStateType.NoBasicFieldsSetAndNoReferencesSet,
      referenceFieldIds: profile
        .getProfileFields()
        .getUnlinkedRequiredOrRecommendedReferences()
        .map((field) => field.getElementId()),
      profileId: profile.getId(),
    }
  }
}
