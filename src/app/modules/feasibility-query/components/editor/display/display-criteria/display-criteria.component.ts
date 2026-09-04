import { Component, computed, inject, input } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { CriteriaGroupComponent } from './criteria-group/criteria-group.component'
import { BoolLogicSwitchComponent } from '../bool-logic-switch/bool-logic-switch.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-display-criteria',
  templateUrl: './display-criteria.component.html',
  styleUrls: ['./display-criteria.component.scss'],
  standalone: true,
  imports: [CriteriaGroupComponent, BoolLogicSwitchComponent, FontAwesomeModule, TranslateModule],
})
export class DisplayCriteriaComponent {
  private readonly queryService = inject(FeasibilityQueryProviderService)

  readonly groupType = input<'Inclusion' | 'Exclusion'>()
  readonly isEditable = input<boolean>()

  private readonly activeQuery = toSignal(this.queryService.getActiveFeasibilityQuery())

  readonly criteriaGroups = computed<string[][]>(() => {
    const query = this.activeQuery()
    if (!query) return []
    return this.groupType() === 'Inclusion'
      ? query.getInclusionCriteria()
      : query.getExclusionCriteria()
  })

  readonly innerLabel = computed<'AND' | 'OR'>(() =>
    this.groupType() === 'Inclusion' ? 'OR' : 'AND'
  )

  readonly outerLabel = computed<'AND' | 'OR'>(() =>
    this.groupType() === 'Exclusion' ? 'OR' : 'AND'
  )

  splitGroup(groupIndex: number, splitIndex: number): void {
    const groups = this.criteriaGroups()
    const updated = [
      ...groups.slice(0, groupIndex),
      groups[groupIndex].slice(0, splitIndex + 1),
      groups[groupIndex].slice(splitIndex + 1),
      ...groups.slice(groupIndex + 1),
    ]
    this.updateCriteria(updated)
  }

  mergeGroups(groupIndex: number): void {
    const groups = this.criteriaGroups()
    const updated = [
      ...groups.slice(0, groupIndex),
      [...groups[groupIndex], ...groups[groupIndex + 1]],
      ...groups.slice(groupIndex + 2),
    ]
    this.updateCriteria(updated)
  }

  private updateCriteria(groups: string[][]): void {
    if (this.groupType() === 'Inclusion') {
      this.queryService.setInclusionCriteria(groups)
    } else {
      this.queryService.setExclusionCriteria(groups)
    }
  }
}
