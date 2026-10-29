import { Component, input, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { HeaderComponent } from '../../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../../shared/components/header-description/header-description.component'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { DisplayActionBarComponent } from '../action-bar/display-action-bar.component'
import { ApplyTimeRestrictionComponent } from './apply-time-restriction/apply-time-restriction.component'
import { DisplayProfilesComponent } from './display-profiles/display-profiles.component'

@Component({
  selector: 'num-display-data-selection',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderDescriptionComponent,
    SectionNameComponent,
    DisplayProfilesComponent,
    DisplayActionBarComponent,
    TranslateModule,
    ApplyTimeRestrictionComponent,
  ],
})
export class DisplayDataSelectionComponent implements OnInit {
  public readonly isEditable = input<boolean>(true)

  constructor() {}

  public ngOnInit(): void {}
}
