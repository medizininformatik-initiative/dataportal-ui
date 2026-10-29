import { Component, computed, effect, inject, input, output } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { ProfileStateType, ProfileValidationService } from 'src/app/service/Validation/Internal/ProfileValidationService.service'
import { FilterChipsComponent } from 'src/app/shared/components/filter-chips/filter-chips.component'
import { MissingFilterComponent } from 'src/app/shared/components/missing-filter/missing-filter.component'
import { InfoTooltipDirective } from 'src/app/shared/directives/info-tooltip.directive'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'

export type FieldsMessageType = 'chips' | 'red' | 'grey'

@Component({
  selector: 'num-fields-col',
  templateUrl: './fields-col.component.html',
  styleUrls: ['./fields-col.component.scss'],
  standalone: true,
  imports: [DisplayTranslationPipe, FilterChipsComponent, InfoTooltipDirective, MatTooltip, MissingFilterComponent, TranslateModule],
})
export class FieldsColComponent {
  private readonly fieldsFilterChipsService = inject(DataSelectionFieldsChipsService)
  private readonly profileValidationService = inject(ProfileValidationService)

  public readonly profile = input<DataSelectionProfile>()
  public readonly navigate = output<void>()
  public readonly searchTerm = input<string | undefined>(undefined)

  public readonly filterChips = toSignal(this.fieldsFilterChipsService.filterChips$, {
    initialValue: [] as FilterChipData[],
  })

  public readonly messageType = computed<FieldsMessageType>(() => {
    const profile = this.profile()
    if (!profile) {
      return 'chips'
    }
    const { state } = this.profileValidationService.validate(profile)
    if (state === ProfileStateType.NoBasicFieldsSetAndNoReferencesSet) {
      return 'red'
    }
    if (state === ProfileStateType.NoBasicFieldsSetButReferencesSet) {
      return 'grey'
    }

    return 'chips'
  })

  public readonly profileLabel = computed(() => this.profile()?.getLabel())

  constructor() {
    effect(() => {
      const fields = this.profile()?.getProfileFields()?.getSelectedBasicFields() ?? []
      this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(fields)
    })
  }
}
