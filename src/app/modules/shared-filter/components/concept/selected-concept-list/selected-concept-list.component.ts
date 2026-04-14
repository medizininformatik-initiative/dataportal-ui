import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service';
import { SelectedListItem } from 'src/app/shared/components/selected-items-list/selected-items-list.component';

@Component({
  selector: 'num-selected-concept-list',
  templateUrl: './selected-concept-list.component.html',
  styleUrls: ['./selected-concept-list.component.scss'],
})
export class SelectedConceptListComponent implements OnInit {
  @Input()
  selectedConcepts: Concept[] = [];

  @Output()
  changedSelectedConcepts = new EventEmitter<Concept[]>();

  constructor(private conceptProviderService: SelectedConceptFilterProviderService) {}

  ngOnInit(): void {}

  get listItems(): SelectedListItem[] {
    return this.selectedConcepts.map((c) => ({
      display: c.getDisplay(),
      code: c.getTerminologyCode().getCode(),
    }));
  }

  public removeAtIndex(index: number): void {
    const concept = this.selectedConcepts[index];
    this.conceptProviderService.removeConcept(concept);
    this.changedSelectedConcepts.emit(this.conceptProviderService.getSelectedConceptsValue());
  }
}
