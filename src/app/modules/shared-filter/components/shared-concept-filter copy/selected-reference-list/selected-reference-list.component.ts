import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { ReferenceCriteriaListEntry } from 'src/app/model/Search/ListEntries/ReferenceCriteriaListEntry';

@Component({
  selector: 'num-selected-reference-list',
  templateUrl: './selected-reference-list.component.html',
  styleUrls: ['./selected-reference-list.component.scss'],
})
export class SelectedReferenceListComponent implements OnInit {
  @Input()
  selectedReferences: ReferenceCriterion[] = [];

  @Output()
  changedSelectedReferences = new EventEmitter<ReferenceCriterion[]>();

  constructor() {}

  ngOnInit(): void {}

  public removeSelectedReference(selectedReference: ReferenceCriterion): void {
    const updatedReferences = this.selectedReferences.filter(
      (ref) => ref.getId() !== selectedReference.getId()
    );
    this.changedSelectedReferences.emit(updatedReferences);
  }
}
