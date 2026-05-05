import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'num-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptComponent implements OnChanges, OnInit {
  @Input()
  conceptFilter: ConceptFilter;

  @Output()
  changedConceptFilter = new EventEmitter<ConceptFilter>();

  @Input()
  display: Display;

  expanded = false;

  tabChanged = false;

  selectedConcepts: Concept[] = [];

  constructor() {}

  ngOnInit() {
    this.selectedConcepts = this.conceptFilter.getSelectedConcepts();
  }

  ngOnChanges(): void {
    this.selectedConcepts = this.conceptFilter.getSelectedConcepts();
  }

  public emitConceptFilter(selectedConcepts: Concept[]) {
    const newConceptFilter = new ConceptFilter(
      uuidv4(),
      this.conceptFilter.getAllowedConceptUrls(),
      selectedConcepts
    );
    this.changedConceptFilter.emit(newConceptFilter);
  }

  public onTabChange(): void {
    this.tabChanged = !this.tabChanged;
  }
}
