import { AsyncPipe } from '@angular/common'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { Component, inject, input, OnInit } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { CriterionMenuItems } from '../../service/Menu/Criterion/CriterionMenuItems.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../menu/menu.component'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
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
  ],
})
export class CriteriaBoxComponent implements OnInit {
  private menuService = inject(CriterionMenuItems)
  private filterChipsService = inject(CriterionFilterChipService)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)

  readonly criterion = input<Criterion>()
  readonly isEditable = input<boolean>()

  menuItems: MenuItemInterface[] = []

  referenceCriterion: ReferenceCriterion[] = []

  $filterChips: Observable<FilterChipData[]> = of([])

  system!: Display

  isFilterRequired!: boolean

  warningSignUrl = 'assets/img/alert-blue-white.png'

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.system = TerminologySystemDictionary.getNameByUrl(
      this.criterion().getTermCodes()[0].getSystem()
    )
    this.getMenuItems()
    this.getFilterChips()
    this.isFilterRequired = !this.criterion().getIsRequiredFilterSet()
  }

  private getMenuItems() {
    this.menuItems = this.menuService.getMenuItemsForCriterion()
  }

  private getFilterChips() {
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
}
