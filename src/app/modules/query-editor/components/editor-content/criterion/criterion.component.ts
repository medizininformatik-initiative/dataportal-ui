import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Observable } from 'rxjs';

@Component({
  selector: 'num-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.scss'],
})
export class CriterionComponent implements OnInit, AfterViewInit {
  @Input() id: string;

  concept: ConceptFilter;

  @ViewChild('timeRestriction', { static: false, read: TemplateRef })
  timeRestrictionTemplate: TemplateRef<any>;

  criterion$: Observable<Criterion>;

  dseElement$: Observable<DataSelectionProfile>;
  currentTemplates: TemplateRef<any>[] = [];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getCriterionFromProviderById(this.id);
  }

  private getCriterionFromProviderById(id: string) {}
}
