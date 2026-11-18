import { CdkDropList } from '@angular/cdk/drag-drop'
import { Component, computed, inject, input, OnInit } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { DisplayCriteriaComponent } from './display-criteria/display-criteria.component'
import { FeasibilityQueryProviderService } from 'src/app/service/Provider/FeasibilityQueryProvider.service'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { Subscription } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-display-feasibility-query',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  standalone: true,
  imports: [
    SectionNameComponent,
    DisplayCriteriaComponent,
    CdkDropList,
    DropGroupDirective,
    TranslateModule,
  ],
})
export class DisplayFeasibilityQueryComponent implements OnInit {
  droppedItems: Criterion[] = []
  groupType: 'Inclusion' | 'Exclusion'
  querySubscription: Subscription

  readonly isEditable = input<boolean>(undefined)

  private readonly activeQuery = toSignal(
    inject(FeasibilityQueryProviderService).getActiveFeasibilityQuery()
  )

  readonly inclusionCount = computed(() =>
    this.countCriteria(this.activeQuery()?.getInclusionCriteria())
  )
  readonly exclusionCount = computed(() =>
    this.countCriteria(this.activeQuery()?.getExclusionCriteria())
  )

  private countCriteria(groups: string[][] = []): number {
    return groups.reduce((sum, group) => sum + group.length, 0)
  }

  constructor() {}

  ngOnInit() {}
}
