import { Component, computed, inject, input, output } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { CriteriaBoxComponent } from '../../../../../../../shared/components/criteria-box/criteria-box.component'
import { BoolLogicSwitchComponent } from '../../bool-logic-switch/bool-logic-switch.component'

@Component({
  selector: 'num-criteria-group',
  templateUrl: './criteria-group.component.html',
  styleUrls: ['./criteria-group.component.scss'],
  standalone: true,
  imports: [CriteriaBoxComponent, BoolLogicSwitchComponent],
})
export class CriteriaGroupComponent {
  private readonly criterionProvider = inject(CriterionProviderService)

  readonly criterionIds = input.required<string[]>()
  readonly isEditable = input<boolean>()
  readonly innerLabel = input<'AND' | 'OR'>('OR')

  readonly splitAt = output<number>()

  private readonly allCriteria = toSignal(this.criterionProvider.getAll(), { requireSync: true })

  readonly criteria = computed<Criterion[]>(() =>
    this.criterionIds().map((id) => this.allCriteria().find((c) => c.getId() === id)!)
  )
}
