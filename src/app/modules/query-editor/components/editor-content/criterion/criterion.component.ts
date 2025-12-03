import { Component, Input, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CreateCriterionService } from 'src/app/service/Criterion/CreateCriterionService';
import { CreateDataSelectionProfileService } from 'src/app/service/DataSelection/CreateDataSelectionProfile.service';

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

  constructor(private dse: CreateDataSelectionProfileService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getCriterionFromProviderById(this.id);
  }

  private getCriterionFromProviderById(id: string) {}
}
