import { Component, OnChanges, OnInit, input, output } from '@angular/core'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry'
import { SelectedListItem } from 'src/app/shared/components/selected-items-list/selected-items-list.component'
import { SelectedItemsListComponent } from '../../../../shared/components/selected-items-list/selected-items-list.component'

@Component({
  selector: 'num-selected-reference-list',
  templateUrl: './selected-reference-list.component.html',
  styleUrls: ['./selected-reference-list.component.scss'],
  standalone: true,
  imports: [SelectedItemsListComponent],
})
export class SelectedReferenceListComponent implements OnInit, OnChanges {
  readonly selectedReferences = input<ReferenceCriterion[]>([])

  readonly changedSelectedReferences = output<ReferenceCriterion[]>()

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

  get listItems(): SelectedListItem[] {
    return this.selectedReferences().map((ref) => ({
      display: ref.getDisplay(),
      code: ref.getTermCodes()[0].getCode(),
    }))
  }

  public removeAtIndex(index: number): void {
    const updatedReferences = this.selectedReferences().filter((_, i) => i !== index)
    this.changedSelectedReferences.emit(updatedReferences)
  }
}
