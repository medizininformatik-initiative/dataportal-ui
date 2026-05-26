import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { Component, Input, OnInit } from '@angular/core'
import { Observable, of } from 'rxjs'
import { CriterionMenuItems } from '../../service/Menu/Criterion/CriterionMenuItems.service'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { MatTooltip } from '@angular/material/tooltip'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { MenuComponent } from '../menu/menu.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ReferenceCriteriaBoxComponent } from '../reference-criteria-box/reference-criteria-box.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

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
  @Input() criterion!: Criterion
  @Input() isEditable!: boolean

  menuItems: MenuItemInterface[] = []

  referenceCriterion: ReferenceCriterion[] = []

  $filterChips: Observable<FilterChipData[]> = of([])

  system!: Display

  isFilterRequired!: boolean

  warningSignUrl = 'assets/img/alert-blue-white.png'

  constructor(
    private menuService: CriterionMenuItems,
    private filterChipsService: CriterionFilterChipService,
    private referenceCriterionProvider: ReferenceCriterionProviderService
  ) {}

  ngOnInit() {
    this.system = TerminologySystemDictionary.getNameByUrl(
      this.criterion.getTermCodes()[0].getSystem()
    )
    this.getMenuItems()
    this.getFilterChips()
    this.isFilterRequired = !this.criterion.getIsRequiredFilterSet()
  }

  private getMenuItems() {
    this.menuItems = this.menuService.getMenuItemsForCriterion()
  }

  private getFilterChips() {
    this.$filterChips = this.filterChipsService.generateFilterChipsFromCriterion(this.criterion)
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
