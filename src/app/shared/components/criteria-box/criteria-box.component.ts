import { AsyncPipe } from '@angular/common'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { Component, computed, inject, input, OnInit } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { CriterionMenuItems } from '../../service/Menu/Criterion/CriterionMenuItems.service'
import { CriterionValidationService } from 'src/app/service/Validation/Internal/CriterionValidationService.service'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../menu/menu.component'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { Observable, of } from 'rxjs'
import { ReferenceCriteriaBoxComponent } from '../reference-criteria-box/reference-criteria-box.component'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-box',
  templateUrl: './criteria-box.component.html',
  styleUrls: ['./criteria-box.component.scss'],
  providers: [CriterionFilterChipService],
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatTooltip,
    FilterChipsComponent,
    MenuComponent,
    FontAwesomeModule,
    ReferenceCriteriaBoxComponent,
    AsyncPipe,
    TranslateModule,
    DisplayTranslationPipe,
    MissingFilterComponent,
  ],
})
export class CriteriaBoxComponent implements OnInit {
  private menuService = inject(CriterionMenuItems)
  private filterChipsService = inject(CriterionFilterChipService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly criterionValidationService = inject(CriterionValidationService)

  readonly criterion = input.required<Criterion>()
  readonly isEditable = input<boolean>()

  readonly menuItems = this.menuService.getMenuItemsForCriterion()

  referenceCriterion: ReferenceCriterion[] = []

  $filterChips: Observable<FilterChipData[]> = of([])

  /**
   * The system is derived from the first term code of the criterion, as this is mandatory. The system is then looked up in the TerminologySystemDictionary to get a user-friendly name for display purposes.
   */
  readonly system = computed(() => {
    return TerminologySystemDictionary.getNameByUrl(this.criterion().getTermCodes()[0].getSystem())
  })

  /**
   * A filter is considered required if the criterion does not have a required filter set. This is determined by the getIsRequiredFilterSet method of the Criterion class. If this method returns false, it means that there are required filters that have not been set, and thus the criterion is considered to be in a state where required filters are missing.
   */
  readonly isFilterRequired = computed(() =>
    this.criterionValidationService.isRequiredFilterSet(this.criterion())
  )

  readonly warningSignUrl = 'assets/img/alert-blue-white.png'

  constructor() {}

  ngOnInit() {
    this.$filterChips = this.filterChipsService.generateFilterChipsFromCriterion(this.criterion())
  }

  public getReferenceCriteriaFromFilter(attributeFilter: AttributeFilter): ReferenceCriterion[] {
    return attributeFilter
      .getReference()
      .getSelectedReferenceIds()
      .reduce((acc, id) => {
        try {
          acc.push(this.referenceCriterionProvider.getOne(id))
        } catch {
          // not yet in provider
        }
        return acc
      }, [] as ReferenceCriterion[])
  }

  public navigateToEditPage() {
    this.navigationHelperService.navigateToEditCriterion(this.criterion().getId())
  }
}
