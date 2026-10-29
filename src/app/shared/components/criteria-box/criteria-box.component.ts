import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { AsyncPipe } from '@angular/common'
import { Component, computed, inject, input, OnInit } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { CriterionValidationService } from 'src/app/service/Validation/Internal/CriterionValidationService.service'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { CriterionMenuItemsService } from '../../service/Menu/Criterion/CriterionMenuItems.service'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { MenuComponent } from '../menu/menu.component'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
import { ReferenceCriteriaBoxComponent } from '../reference-criteria-box/reference-criteria-box.component'

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
    NumDataCyDirective,
  ],
})
export class CriteriaBoxComponent implements OnInit {
  private readonly menuService = inject(CriterionMenuItemsService)
  private readonly filterChipsService = inject(CriterionFilterChipService)
  private readonly referenceCriterionProvider = inject(ReferenceCriterionProviderService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly criterionValidationService = inject(CriterionValidationService)

  public readonly criterion = input.required<Criterion>()
  public readonly isEditable = input<boolean>()

  public readonly menuItems = this.menuService.getMenuItems()

  public referenceCriterion: ReferenceCriterion[] = []

  public $filterChips: Observable<FilterChipData[]> = of([])

  /**
   * The system is derived from the first term code of the criterion, as this is mandatory. The system is then looked up in the TerminologySystemDictionary to get a user-friendly name for display purposes.
   */
  public readonly system = computed(() => {
    return TerminologySystemDictionary.getNameByUrl(this.criterion().getTermCodes()[0].getSystem())
  })

  /**
   * A filter is considered required if the criterion does not have a required filter set. This is determined by the getIsRequiredFilterSet method of the Criterion class. If this method returns false, it means that there are required filters that have not been set, and thus the criterion is considered to be in a state where required filters are missing.
   */
  public readonly isFilterRequired = computed(() => this.criterionValidationService.isRequiredFilterSet(this.criterion()))

  public readonly warningSignUrl = 'assets/img/alert-blue-white.png'

  constructor() {}

  public ngOnInit() {
    this.$filterChips = this.filterChipsService.generateFilterChipsFromCriterion(this.criterion())
  }

  public getReferenceCriteriaFromFilter(attributeFilter: AttributeFilter): ReferenceCriterion[] {
    return attributeFilter
      .getReference()
      .getSelectedReferenceIds()
      .reduce((acc: ReferenceCriterion[], id: string) => {
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
