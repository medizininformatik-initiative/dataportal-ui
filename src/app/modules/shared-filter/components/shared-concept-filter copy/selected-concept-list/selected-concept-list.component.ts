import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service';

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

  public removeSelectedConcept(selectedConcept: Concept): void {
    this.conceptProviderService.removeConcept(selectedConcept);
    this.changedSelectedConcepts.emit(this.conceptProviderService.getSelectedConceptsValue());
  }
}
