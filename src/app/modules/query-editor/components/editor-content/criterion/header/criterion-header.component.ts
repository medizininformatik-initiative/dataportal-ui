import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { CriterionFilterChipService } from 'src/app/shared/service/FilterChips/Criterion/CriterionFilterChips.service'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { FilterChipData } from '../../../../../../shared/models/FilterChips/FilterChipData'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-criterion-header',
  templateUrl: './criterion-header.component.html',
  styleUrls: ['./criterion-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FilterChipsComponent, TranslateModule, DisplayTranslationPipe],
})
export class CriterionHeaderComponent {
  private readonly filterChipsService = inject(CriterionFilterChipService)

  public readonly criterion = input.required<Criterion>()

  public readonly quantityFilterChips = computed<FilterChipData[]>(() => this.filterChipsService.generateQuantityChips(this.criterion()))

  public readonly timeRestrictionFilterChips = computed<FilterChipData[]>(() =>
    this.filterChipsService.buildTimeRestrictionChips(this.criterion())
  )

  public readonly termCodesFilterChips = computed<FilterChipData[]>(() => this.filterChipsService.generateTermcodeChips(this.criterion()))

  public readonly conceptFilterChips = computed<FilterChipData[]>(() => this.filterChipsService.generateConceptChips(this.criterion()))

  public readonly refernceFilterChips = computed<FilterChipData[]>(() => this.filterChipsService.createReferenceChips(this.criterion()))

  public readonly system = computed<Display>(() => TerminologySystemDictionary.getNameByUrl(this.criterion().getTermCodes()[0].getSystem()))

  constructor() {}
}
