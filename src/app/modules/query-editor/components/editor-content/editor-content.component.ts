import { Component, input } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { CriterionComponent } from './criterion/criterion.component'
import { ProfileComponent } from './profile/profile.component'
import { ReferenceEditComponent } from './reference/reference-edit.component'

@Component({
  selector: 'num-editor-content',
  templateUrl: './editor-content.component.html',
  styleUrls: ['./editor-content.component.scss'],
  standalone: true,
  imports: [ProfileComponent, CriterionComponent, ReferenceEditComponent],
})
export class EditorContentComponent {
  public readonly criterion = input<Criterion>()

  public readonly dataSelectionProfile = input<DataSelectionProfile>()

  public readonly referenceCriterion = input<ReferenceCriterion>()

  constructor() {}
}
