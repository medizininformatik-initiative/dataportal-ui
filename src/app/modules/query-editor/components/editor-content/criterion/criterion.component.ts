import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters';
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { EditCriterionService } from 'src/app/service/Criterion/Edit/EditCriterion.service';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Component({
  selector: 'num-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriterionComponent implements OnChanges, OnInit, AfterViewInit {
  @Input()
  criterion: Criterion;

  attributeFilters: AbstractAttributeFilters[] = [];

  referenceFilter: AbstractAttributeFilters[] = [];

  conceptValueFilter: ValueFilter[] = [];

  conceptAttributeFilter: AttributeFilter[] = [];

  quantityValueFilter: ValueFilter[] = [];

  quantityAttributeFilter: AttributeFilter[] = [];

  @ViewChild('timeRestriction', { static: false, read: TemplateRef })
  timeRestrictionTemplate: TemplateRef<any>;

  @ViewChild('conceptAttributeFilterTemplate', { static: false, read: TemplateRef })
  conceptAttributeFiltersTemplate: TemplateRef<any>;

  @ViewChild('conceptValueFilterTemplate', { static: false, read: TemplateRef })
  conceptValueFiltersTemplate: TemplateRef<any>;

  @ViewChild('termCodes', { static: false, read: TemplateRef })
  termCodesTemplate: TemplateRef<any>;

  @ViewChild('reference', { static: false, read: TemplateRef })
  referenceTemplate: TemplateRef<any>;

  @ViewChild('quantityAttributeFilterTemplate', { static: false, read: TemplateRef })
  quantityAttributeFilterTemplate: TemplateRef<any>;

  @ViewChild('quantityValueFilterTemplate', { static: false, read: TemplateRef })
  quantityValueFilterTemplate: TemplateRef<any>;

  templates: { template: TemplateRef<any>; name: string }[] = [];

  constructor(private criterionEditService: EditCriterionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initializeFromCriterion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.criterion && this.criterion) {
      this.initializeFromCriterion();
    }
  }

  private initializeFromCriterion(): void {
    this.criterionEditService.initialize(this.criterion);
    this.attributeFilters = this.criterion.getConceptAttributeFilters();
    this.referenceFilter = this.criterion.getReferenceAttributeFilters();
    this.quantityAttributeFilter = this.criterion.getQuantityAttributeFilters();
    this.quantityValueFilter = this.criterion.getQuantityValueFilters();
    this.conceptAttributeFilter = this.criterion.getConceptAttributeFilters();
    this.conceptValueFilter = this.criterion.getConceptValueFilters();
  }

  ngAfterViewInit() {
    this.templates = [];
    this.buildTemplates();
    this.cdr.detectChanges();
  }

  private buildTemplates(): void {
    this.setConceptAttributeFilterTemplate();
    this.setConceptValueFilterTemplate();
    this.setQuantityAttributeFilterTemplate();
    this.setQuantityValueFilterTemplate();
    this.setReferenceTemplate();
    this.setTermCodesTemplate();
    this.setTimeRestrictionTemplate();
  }

  private setTimeRestrictionTemplate(): void {
    if (this.criterion.getTimeRestriction()) {
      this.templates.push({ template: this.timeRestrictionTemplate, name: 'TIMERESTRICTION' });
    }
  }

  private setTermCodesTemplate(): void {
    if (this.criterion.getTermCodes().length > 1) {
      this.templates.push({ template: this.termCodesTemplate, name: 'TERMCODE' });
    }
  }

  private setReferenceTemplate(): void {
    if (this.referenceFilter.length > 0) {
      this.templates.push({ template: this.referenceTemplate, name: 'REFERENCE' });
    }
  }

  private setQuantityValueFilterTemplate(): void {
    if (this.quantityValueFilter.length > 0) {
      this.templates.push({ template: this.quantityValueFilterTemplate, name: 'QUANTITY' });
    }
  }

  private setQuantityAttributeFilterTemplate(): void {
    if (this.quantityAttributeFilter.length > 0) {
      this.templates.push({ template: this.quantityAttributeFilterTemplate, name: 'QUANTITY' });
    }
  }

  private setConceptValueFilterTemplate(): void {
    if (this.conceptValueFilter.length > 0) {
      this.templates.push({ template: this.conceptValueFiltersTemplate, name: 'CONCEPT' });
    }
  }

  private setConceptAttributeFilterTemplate(): void {
    if (this.conceptAttributeFilter.length > 0) {
      this.templates.push({ template: this.conceptAttributeFiltersTemplate, name: 'CONCEPT' });
    }
  }

  public updateConceptAttributeFilter(
    conceptFilter: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.criterionEditService.updateConceptAttributeFilter(conceptFilter, attributeFilter);
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.criterionEditService.updateQuantityAttributeFilter(quantityFilter, attributeFilter);
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    this.criterionEditService.updateTimeRestriction(timeRestriction);
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    this.criterionEditService.updateTermCodes(termCodes);
  }

  public updateReferenceFilter(ids: string[], attributeFilter: AttributeFilter): void {
    this.criterionEditService.updateReferenceFilter(ids, attributeFilter);
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    this.criterionEditService.updateQuantityValueFilter(quantityFilter);
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    this.criterionEditService.updateConceptValueFilter(conceptFilter);
  }
}
