import { AsyncPipe } from '@angular/common'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core'
import { CriteriaBoxCollapseService } from 'src/app/service/Provider/CriteriaBoxCollapse.service'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { CriterionValidationService } from 'src/app/service/Validation/Internal/CriterionValidationService.service'
import { CriterionMenuItemsService } from '../../service/Menu/Criterion/CriterionMenuItems.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../menu/menu.component'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { Observable, of } from 'rxjs'
import { ReferenceCriteriaBoxComponent } from '../reference-criteria-box/reference-criteria-box.component'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceFilterChipService } from '../../service/FilterChips/Criterion/ReferenceFilterChip.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-criteria-box',
  templateUrl: './criteria-box.component.html',
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
    NumDataCyDirective,
  ],
})
export class CriteriaBoxComponent implements OnInit {
  private menuService = inject(CriterionMenuItemsService)
  private filterChipsService = inject(CriterionFilterChipService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private referenceFilterChipService = inject(ReferenceFilterChipService)
  private collapseService = inject(CriteriaBoxCollapseService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly criterionValidationService = inject(CriterionValidationService)

  readonly criterion = input.required<Criterion>()
  readonly isEditable = input<boolean>()

  readonly menuItems = this.menuService.getMenuItems()

  referenceCriterion: ReferenceCriterion[] = []

  $filterChips: Observable<FilterChipData[]> = of([])

  /** Collapsed: the reference boxes are hidden and the references show up as chips in the tile. */
  referenceChips: FilterChipData[] = []

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

  readonly faChevronDown = faChevronDown
  readonly faChevronRight = faChevronRight

  /** Collapsed: title and type · code on one line each, no filter chips. */
  readonly collapsed = signal(false)

  constructor() {
    // follows the global collapse-all / expand-all state (also on first render, from local storage);
    // the chevron of a single box still works until the next global change
    effect(() => this.setCollapsed(this.collapseService.collapsed()))
  }

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

  public toggleCollapsed(): void {
    this.setCollapsed(!this.collapsed())
  }

  private setCollapsed(collapsed: boolean): void {
    this.collapsed.set(collapsed)
    if (collapsed) {
      this.referenceChips = this.buildReferenceCountChip()
    }
  }

  /** One chip with the number of references, not one chip per reference. */
  private buildReferenceCountChip(): FilterChipData[] {
    const count = this.referenceFilterChipService
      .generateReferenceChips(this.criterion())
      .reduce((sum, chip) => sum + chip.data.length, 0)
    return count
      ? [
          {
            type: 'SHARED_COMPONENTS.CRITERIA_BOX.REFERENCES',
            data: [{ id: 'reference-count', text: String(count), expanded: false }],
          },
        ]
      : []
  }

  public navigateToEditPage() {
    this.navigationHelperService.navigateToEditCriterion(this.criterion().getId())
  }
}
