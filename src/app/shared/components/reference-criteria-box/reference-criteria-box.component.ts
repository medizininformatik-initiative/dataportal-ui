import { Component, OnInit, inject, input } from '@angular/core'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { MenuItemInterface } from '../../models/Menu/MenuItemInterface'
import { Observable, of } from 'rxjs'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionMenuItemsService } from '../../service/Menu/ReferenceCriterion/ReferenceCriterionMenuItems.service'
import { TerminologySystemDictionary } from '../../../model/Utilities/TerminologySystemDictionary'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { MatTooltip } from '@angular/material/tooltip'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { MenuComponent } from '../menu/menu.component'
import { AsyncPipe } from '@angular/common'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-reference-criteria-box',
  templateUrl: './reference-criteria-box.component.html',
  styleUrls: ['./reference-criteria-box.component.scss'],
  providers: [CriterionFilterChipService],
  standalone: true,
  imports: [
    CdkDrag,
    MatTooltip,
    FilterChipsComponent,
    MenuComponent,
    AsyncPipe,
    DisplayTranslationPipe,
  ],
})
export class ReferenceCriteriaBoxComponent implements OnInit {
  private menuService = inject(ReferenceCriterionMenuItemsService)
  private filterChipsService = inject(CriterionFilterChipService)

  readonly referenceCriterion = input<ReferenceCriterion>(undefined)

  readonly criterionId = input<string>(undefined)

  menuItems: MenuItemInterface[] = []

  $filterChips: Observable<FilterChipData[]> = of([])

  translatedSystem: Display

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.getMenuItems()
    this.getFilterChips()
    this.translatedSystem = TerminologySystemDictionary.getNameByUrl(
      this.referenceCriterion().getTermCodes()[0].getSystem()
    )
  }

  private getMenuItems() {
    this.menuItems = this.menuService.getMenuItems()
  }

  private getFilterChips() {
    this.$filterChips = this.filterChipsService.generateFilterChipsFromCriterion(
      this.referenceCriterion()
    )
  }
}
