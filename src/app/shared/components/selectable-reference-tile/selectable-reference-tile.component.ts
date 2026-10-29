import { Component, OnInit, input, output } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { CheckboxComponent } from '../checkbox/checkbox.component'

@Component({
  selector: 'num-selectable-reference-tile',
  templateUrl: './selectable-reference-tile.component.html',
  styleUrls: ['./selectable-reference-tile.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, DisplayTranslationPipe],
})
export class SelectableReferenceTileComponent implements OnInit {
  public readonly possibleReference = input<PossibleProfileReferenceData>(undefined)

  public readonly selectedProfile = output<PossibleProfileReferenceData>()

  public display: string

  public label: string

  constructor() {}

  public ngOnInit(): void {
    this.display = this.possibleReference().display.getOriginal()
    this.label = this.possibleReference().label
  }

  public checkboxSelected(possibleReference: PossibleProfileReferenceData): void {
    this.selectedProfile.emit(possibleReference)
  }
}
