import { ApplyTimeRestrictionComponent } from './stage/apply-time-restriction/apply-time-restriction.component'
import { CdkDropListGroup } from '@angular/cdk/drag-drop'
import { StageProviderService } from 'src/app/service/Provider/StageProvider.service'
import { map } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { Component, inject, OnInit, signal } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { CriteriaBoxCollapseService } from 'src/app/service/Provider/CriteriaBoxCollapse.service'
import { CriteriaStageComponent } from './stage/criteria-stage.component'
import { DisplayFeasibilityQueryComponent } from './display/display.component'
import { EditorActionBarComponent } from './action-bar/editor-action-bar.component'
import { HeaderComponent } from '../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../shared/components/header-description/header-description.component'
import { SectionNameComponent } from '../../../../shared/components/section-name/section-name.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-edit-feasibility-query',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: true,
  imports: [
    ApplyTimeRestrictionComponent,
    CdkDropListGroup,
    HeaderComponent,
    HeaderDescriptionComponent,
    SectionNameComponent,
    CriteriaStageComponent,
    DisplayFeasibilityQueryComponent,
    EditorActionBarComponent,
    FontAwesomeModule,
    MatTooltip,
    TranslateModule,
  ],
})
export class EditFeasibilityQueryComponent implements OnInit {
  protected readonly collapseService = inject(CriteriaBoxCollapseService)
  protected readonly selectedOpen = signal(true)
  protected readonly selectedCount = toSignal(
    inject(StageProviderService)
      .getAll()
      .pipe(map((uids) => uids.length)),
    { initialValue: 0 }
  )

  constructor() {}

  ngOnInit(): void {}
}
