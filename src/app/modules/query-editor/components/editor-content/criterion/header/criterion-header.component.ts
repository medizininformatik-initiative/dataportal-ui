import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionFilterChipService } from 'src/app/shared/service/FilterChips/Criterion/CriterionFilterChips.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../../../../../shared/models/FilterChips/FilterChipData'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criterion-header',
  templateUrl: './criterion-header.component.html',
  styleUrls: ['./criterion-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FilterChipsComponent, TranslateModule, DisplayTranslationPipe],
})
export class CriterionHeaderComponent {
  private filterChipsService = inject(CriterionFilterChipService)

  readonly criterion = input.required<Criterion>()

  readonly quantityFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.generateQuantityChips(this.criterion())
  )

  readonly timeRestrictionFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.buildTimeRestrictionChips(this.criterion())
  )

  readonly termCodesFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.generateTermcodeChips(this.criterion())
  )

  readonly conceptFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.generateConceptChips(this.criterion())
  )

  readonly refernceFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.createReferenceChips(this.criterion())
  )

  readonly system = computed<Display>(() =>
    TerminologySystemDictionary.getNameByUrl(this.criterion().getTermCodes()[0].getSystem())
  )

  constructor() {}
}
