import { CdkDrag } from '@angular/cdk/drag-drop'
import { AsyncPipe } from '@angular/common'
import { Component, OnInit, inject, input } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { Observable, of } from 'rxjs'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { TerminologySystemDictionary } from '../../../model/Utilities/TerminologySystemDictionary'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { MenuItemInterface } from '../../models/Menu/MenuItemInterface'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { CriterionFilterChipService } from '../../service/FilterChips/Criterion/CriterionFilterChips.service'
import { ReferenceCriterionMenuItemsService } from '../../service/Menu/ReferenceCriterion/ReferenceCriterionMenuItems.service'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { MenuComponent } from '../menu/menu.component'

@Component({
  selector: 'num-reference-criteria-box',
  templateUrl: './reference-criteria-box.component.html',
  styleUrls: ['./reference-criteria-box.component.scss'],
  providers: [CriterionFilterChipService],
  standalone: true,
  imports: [CdkDrag, MatTooltip, FilterChipsComponent, MenuComponent, AsyncPipe, DisplayTranslationPipe],
})
export class ReferenceCriteriaBoxComponent implements OnInit {
  private readonly menuService = inject(ReferenceCriterionMenuItemsService)
  private readonly filterChipsService = inject(CriterionFilterChipService)

  public readonly referenceCriterion = input<ReferenceCriterion>(undefined)

  public readonly criterionId = input<string>(undefined)

  public menuItems: MenuItemInterface[] = []

  public $filterChips: Observable<FilterChipData[]> = of([])

  public translatedSystem: Display

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public ngOnInit() {
    this.getMenuItems()
    this.getFilterChips()
    this.translatedSystem = TerminologySystemDictionary.getNameByUrl(this.referenceCriterion().getTermCodes()[0].getSystem())
  }

  private getMenuItems() {
    this.menuItems = this.menuService.getMenuItems()
  }

  private getFilterChips() {
    this.$filterChips = this.filterChipsService.generateFilterChipsFromCriterion(this.referenceCriterion())
  }
}
