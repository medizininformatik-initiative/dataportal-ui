import { Component, computed, effect, inject, input, output } from '@angular/core'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import {
  DataSelectionValidationService,
  ValidationStateType,
} from 'src/app/service/Validation/DataSelectionValidation.service'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { FilterChipsComponent } from 'src/app/shared/components/filter-chips/filter-chips.component'
import { InfoTooltipDirective } from 'src/app/shared/directives/info-tooltip.directive'
import { MatTooltip } from '@angular/material/tooltip'
import { MissingFilterComponent } from 'src/app/shared/components/missing-filter/missing-filter.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

export type FieldsMessageType = 'chips' | 'red' | 'grey'

@Component({
  selector: 'num-fields-col',
  templateUrl: './fields-col.component.html',
  styleUrls: ['./fields-col.component.scss'],
  standalone: true,
  imports: [
    DisplayTranslationPipe,
    FilterChipsComponent,
    InfoTooltipDirective,
    MatTooltip,
    MissingFilterComponent,
    TranslateModule,
  ],
})
export class FieldsColComponent {
  private readonly fieldsFilterChipsService = inject(DataSelectionFieldsChipsService)
  private readonly validationService = inject(DataSelectionValidationService)

  readonly profile = input<DataSelectionProfile>()
  readonly navigate = output<void>()

  readonly filterChips = toSignal(this.fieldsFilterChipsService.filterChips$, {
    initialValue: [] as FilterChipData[],
  })

  readonly messageType = computed<FieldsMessageType>(() => {
    const profile = this.profile()
    if (!profile) {
      return 'chips'
    }
    const { state } = this.validationService.validateProfile(profile)
    if (state === ValidationStateType.NoBasicFieldsSetAndNoReferencesSet) {
      return 'red'
    }
    if (state === ValidationStateType.NoBasicFieldsSetButReferencesSet) {
      return 'grey'
    }

    return 'chips'
  })

  readonly profileLabel = computed(() => this.profile()?.getLabel())

  constructor() {
    effect(() => {
      const fields = this.profile()?.getProfileFields()?.getSelectedBasicFields() ?? []
      this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(fields)
    })
  }
}
