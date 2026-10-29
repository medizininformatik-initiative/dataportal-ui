import { CdkDropList } from '@angular/cdk/drag-drop'
import { Component, input, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { DropGroupDirective } from '../../../../../shared/directives/drop-group/drop-group.directive'
import { DisplayCriteriaComponent } from './display-criteria/display-criteria.component'

@Component({
  selector: 'num-display-feasibility-query',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  standalone: true,
  imports: [SectionNameComponent, DisplayCriteriaComponent, CdkDropList, DropGroupDirective, TranslateModule],
})
export class DisplayFeasibilityQueryComponent implements OnInit {
  public droppedItems: Criterion[] = []
  public groupType: 'Inclusion' | 'Exclusion'
  public querySubscription: Subscription

  public readonly isEditable = input<boolean>(undefined)

  constructor() {}

  public ngOnInit() {}
}
