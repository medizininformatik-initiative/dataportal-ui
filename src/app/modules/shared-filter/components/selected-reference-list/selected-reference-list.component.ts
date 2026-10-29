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
  public readonly selectedReferences = input<ReferenceCriterion[]>([])

  public readonly changedSelectedReferences = output<ReferenceCriterion[]>()

  constructor() {}

  public ngOnInit(): void {}

  public ngOnChanges(): void {}

  public get listItems(): SelectedListItem[] {
    return this.selectedReferences().map((ref: ReferenceCriterion) => ({
      display: ref.getDisplay(),
      code: ref.getTermCodes()[0].getCode(),
    }))
  }

  public removeAtIndex(index: number): void {
    const updatedReferences = this.selectedReferences().filter((_: ReferenceCriterion, i: number) => i !== index)
    this.changedSelectedReferences.emit(updatedReferences)
  }
}
