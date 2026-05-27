import { ChangeDetectionStrategy, Component, OnChanges, OnInit, inject, input } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionFilterChipService } from 'src/app/shared/service/FilterChips/Criterion/CriterionFilterChips.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterChipData } from '../../../../../../shared/models/FilterChips/FilterChipData'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-criterion-header',
  templateUrl: './criterion-header.component.html',
  styleUrls: ['./criterion-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FilterChipsComponent, TranslateModule, DisplayTranslationPipe],
})
export class CriterionHeaderComponent implements OnChanges, OnInit {
  private filterChipsService = inject(CriterionFilterChipService)

  readonly criterion = input.required<Criterion>()

  quantityFilterChips: FilterChipData[] = []

  timeRestrictionFilterChips: FilterChipData[] = []

  termCodesFilterChips: FilterChipData[] = []

  conceptFilterChips: FilterChipData[] = []

  refernceFilterChips: FilterChipData[] = []

  system: Display

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.iniializeChips()
    this.system = TerminologySystemDictionary.getNameByUrl(
      this.criterion().getTermCodes()[0].getSystem()
    )
  }

  ngOnChanges() {
    this.iniializeChips()
  }

  private iniializeChips() {
    this.getQuantityFilterChips()
    this.getTimeRestrictionFilterChips()
    this.getTermCodesFilterChips()
    this.getConceptFilterChips()
    this.getReferenceFilterChips()
  }

  public getReferenceFilterChips() {
    this.refernceFilterChips = this.filterChipsService.createReferenceChips(this.criterion())
  }

  private getQuantityFilterChips() {
    this.quantityFilterChips = this.filterChipsService.generateQuantityChips(this.criterion())
  }

  private getTimeRestrictionFilterChips() {
    this.timeRestrictionFilterChips = this.filterChipsService.buildTimeRestrictionChips(
      this.criterion()
    )
  }

  private getTermCodesFilterChips() {
    this.termCodesFilterChips = this.filterChipsService.generateTermcodeChips(this.criterion())
  }

  private getConceptFilterChips() {
    this.conceptFilterChips = this.filterChipsService.generateConceptChips(this.criterion())
  }
}
