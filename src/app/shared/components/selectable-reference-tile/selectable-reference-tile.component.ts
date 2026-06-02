import { Component, OnInit, input, output } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-selectable-reference-tile',
  templateUrl: './selectable-reference-tile.component.html',
  styleUrls: ['./selectable-reference-tile.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, DisplayTranslationPipe],
})
export class SelectableReferenceTileComponent implements OnInit {
  readonly possibleReference = input<PossibleProfileReferenceData>(undefined)

  readonly selectedProfile = output<PossibleProfileReferenceData>()

  display: Display

  label: string

  constructor() {}

  ngOnInit(): void {
    this.display = this.possibleReference().display
    this.label = this.possibleReference().label
  }

  public checkboxSelected(possibleReference: PossibleProfileReferenceData): void {
    this.selectedProfile.emit(possibleReference)
  }
}
