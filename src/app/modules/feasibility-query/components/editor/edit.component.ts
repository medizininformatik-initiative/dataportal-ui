import { Component, OnInit } from '@angular/core'
import { CdkDropListGroup } from '@angular/cdk/drag-drop'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { SectionNameComponent } from '../../../../shared/components/section-name/section-name.component'
import { CriteriaStageComponent } from './stage/criteria-stage.component'
import { DisplayFeasibilityQueryComponent } from './display/display.component'
import { EditorActionBarComponent } from './action-bar/editor-action-bar.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-edit-feasibility-query',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: true,
  imports: [
    CdkDropListGroup,
    HeaderComponent,
    HeaderDescriptionComponent,
    SectionNameComponent,
    CriteriaStageComponent,
    DisplayFeasibilityQueryComponent,
    EditorActionBarComponent,
    TranslateModule,
  ],
})
export class EditFeasibilityQueryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
