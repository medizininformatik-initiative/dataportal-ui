import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { Component, OnInit, input, output } from '@angular/core'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InformationSectionComponent } from '../../../../../../../shared/components/information-section/information-section.component'
import { EditTimeRestrictionComponent } from '../../../../../../feasibility-query/components/editor/criterion-modal/time-restriction/edit-time-restriction.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-profile-time-filter',
  templateUrl: './profile-time-filter.component.html',
  styleUrls: ['./profile-time-filter.component.scss'],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FontAwesomeModule,
    InformationSectionComponent,
    EditTimeRestrictionComponent,
    TranslateModule,
  ],
})
export class ProfileTimeFilterComponent implements OnInit {
  readonly profileTimeRestrictionFilter = input<ProfileTimeRestrictionFilter>(undefined)

  readonly changedProfileTimeRestrictionFilter = output<ProfileTimeRestrictionFilter>()

  ngOnInit(): void {}

  public emitProfileTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    const updatedFilter = new ProfileTimeRestrictionFilter(
      this.profileTimeRestrictionFilter().getName(),
      this.profileTimeRestrictionFilter().getType(),
      timeRestriction
    )
    this.changedProfileTimeRestrictionFilter.emit(updatedFilter)
  }
}
