import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
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
  @Input()
  posssibleReference: PossibleProfileReferenceData

  @Output()
  selectedProfileId: EventEmitter<PossibleProfileReferenceData> =
    new EventEmitter<PossibleProfileReferenceData>()

  constructor() {}

  ngOnInit(): void {}

  public selectedReference(profile: PossibleProfileReferenceData): void {
    this.selectedProfileId.emit(profile)
  }
}
