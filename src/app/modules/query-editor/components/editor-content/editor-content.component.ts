import { Component, input } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ProfileComponent } from './profile/profile.component'
import { CriterionComponent } from './criterion/criterion.component'
import { ReferenceEditComponent } from './reference/reference-edit.component'

@Component({
  selector: 'num-editor-content',
  templateUrl: './editor-content.component.html',
  styleUrls: ['./editor-content.component.scss'],
  standalone: true,
  imports: [ProfileComponent, CriterionComponent, ReferenceEditComponent],
})
export class EditorContentComponent {
  readonly criterion = input<Criterion>()

  readonly dataSelectionProfile = input<DataSelectionProfile>()

  readonly referenceCriterion = input<ReferenceCriterion>()

  constructor() {}
}
