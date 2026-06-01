import { Component, input, OnInit } from '@angular/core'
import { DisplayActionBarComponent } from '../action-bar/display-action-bar.component'
import { DisplayProfilesComponent } from './display-profiles/display-profiles.component'
import { HeaderComponent } from '../../../../../shared/components/header/header.component'
import { HeaderDescriptionComponent } from '../../../../../shared/components/header-description/header-description.component'
import { SectionNameComponent } from '../../../../../shared/components/section-name/section-name.component'
import { TranslateModule } from '@ngx-translate/core'

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
  ],
})
export class DisplayDataSelectionComponent implements OnInit {
  readonly isEditable = input<boolean>(true)

  constructor() {}

  ngOnInit(): void {}
}
