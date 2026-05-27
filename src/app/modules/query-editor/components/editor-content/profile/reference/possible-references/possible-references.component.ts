import { Component, OnInit, input, output } from '@angular/core'
import { PossibleProfileReferenceData } from 'src/app/model/Interface/PossibleProfileReferenceData'
import { SelectableReferenceTileComponent } from '../../../../../../../shared/components/selectable-reference-tile/selectable-reference-tile.component'

@Component({
  selector: 'num-possible-references',
  templateUrl: './possible-references.component.html',
  styleUrls: ['./possible-references.component.scss'],
  standalone: true,
  imports: [SelectableReferenceTileComponent],
})
export class PossibleReferencesComponent implements OnInit {
  readonly posssibleReference = input<PossibleProfileReferenceData>(undefined)

  readonly selectedProfileId = output<PossibleProfileReferenceData>()

  constructor() {}

  ngOnInit(): void {}

  public selectedReference(profile: PossibleProfileReferenceData): void {
    this.selectedProfileId.emit(profile)
  }
}
