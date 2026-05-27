import { Component, OnInit, input } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { Subscription } from 'rxjs'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { DisplayCriteriaComponent } from './display-criteria/display-criteria.component'
import { CdkDropList } from '@angular/cdk/drag-drop'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
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

  constructor() {}

  ngOnInit() {}
}
