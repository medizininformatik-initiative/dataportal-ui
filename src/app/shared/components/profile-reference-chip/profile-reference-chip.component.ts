import { Component } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'

@Component({
  selector: 'num-profile-reference-chip',
  templateUrl: './profile-reference-chip.component.html',
  styleUrls: ['./profile-reference-chip.component.scss'],
})
export class ProfileReferenceChipComponent {
  public display: Display

  public label: string

  public linkedProfileId: string

  public elementId: string
}
