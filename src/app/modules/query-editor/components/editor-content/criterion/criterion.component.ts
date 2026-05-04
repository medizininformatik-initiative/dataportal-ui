import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters';
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction';
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { CloneAttributeFilter } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/CloneAttributeFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { EditCriterionService } from 'src/app/service/Criterion/Edit/EditCriterion.service';
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service';
import { Subscription } from 'rxjs';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';

@Component({
  selector: 'num-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriterionComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input()
  criterion!: Criterion;

  attributeFilters: AbstractAttributeFilters[] = [];

  referenceFilter: AbstractAttributeFilters[] = [];

  conceptValueFilter: ValueFilter[] = [];

  conceptAttributeFilter: AttributeFilter[] = [];

  quantityValueFilter: ValueFilter[] = [];

  quantityAttributeFilter: AttributeFilter[] = [];

  @ViewChild('timeRestriction', { static: false, read: TemplateRef })
  timeRestrictionTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('conceptAttributeFilterTemplate', { static: false, read: TemplateRef })
  conceptAttributeFiltersTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('conceptValueFiltersTemplate', { static: false, read: TemplateRef })
  conceptValueFiltersTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('termCodes', { static: false, read: TemplateRef })
  termCodesTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('reference', { static: false, read: TemplateRef })
  referenceTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('quantityAttributeFilterTemplate', { static: false, read: TemplateRef })
  quantityAttributeFilterTemplate: TemplateRef<any> | undefined = undefined;

  @ViewChild('quantityValueFilterTemplate', { static: false, read: TemplateRef })
  quantityValueFilterTemplate: TemplateRef<any> | undefined = undefined;

  templates: any[] = [];

  referenceSubscription: Subscription | undefined = undefined;

  constructor(
    private criterionEditService: EditCriterionService,
    private cdr: ChangeDetectorRef,
    private referenceCriterionProvider: ReferenceCriterionProviderService
  ) {}

  ngOnInit() {
    this.initializeFromCriterion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeFromCriterion();
  }

  ngOnDestroy(): void {
    this.referenceSubscription?.unsubscribe();
  }

  private initializeFromCriterion(): void {
    this.criterionEditService.initialize(this.criterion);
    this.attributeFilters = this.criterion.getConceptAttributeFilters();
    this.referenceFilter = this.criterion.getReferenceAttributeFilters();
    this.quantityAttributeFilter = this.criterion.getQuantityAttributeFilters();
    this.quantityValueFilter = this.criterion.getQuantityValueFilters();
    this.conceptAttributeFilter = CloneAttributeFilter.deepCopyAttributeFilters(
      this.criterion.getConceptAttributeFilters()
    );
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
    console.log('Templates set in criterion component', this.templates);
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
      const display = this.quantityValueFilter[0].getDisplay();
      this.templates.push({ template: this.quantityValueFilterTemplate, display });
    }
  }

  private setQuantityAttributeFilterTemplate(): void {
    if (this.quantityAttributeFilter.length > 0) {
      const display = this.quantityAttributeFilter[0].getDisplay();
      this.templates.push({ template: this.quantityAttributeFilterTemplate, display });
    }
  }

  private setConceptValueFilterTemplate(): void {
    if (this.conceptValueFilter.length > 0) {
      this.templates.push({ template: this.conceptValueFiltersTemplate, name: 'CONCEPT' });
    }
  }

  private setConceptAttributeFilterTemplate(): void {
    this.conceptAttributeFilter.forEach((filter, index) => {
      const display = filter.getDisplay();
      this.templates.push({
        template: this.conceptAttributeFiltersTemplate,
        display,
        context: { $implicit: index },
      });
    });
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

  public updateReferenceFilter(id: string, attributeFilter: AttributeFilter): void {
    this.referenceSubscription?.unsubscribe();
    this.referenceSubscription = this.criterionEditService
      .addReferenceCriteria(id, attributeFilter)
      .subscribe();
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    this.criterionEditService.updateQuantityValueFilter(quantityFilter);
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    this.criterionEditService.updateConceptValueFilter(conceptFilter);
  }

  public updateSelectedReferences(
    attributeFilter: AttributeFilter,
    updatedReferences: ReferenceCriterion[]
  ): void {
    this.criterionEditService.updateSelectedReferences(attributeFilter, updatedReferences);
  }

  public resolveReferenceCriteria(attributeFilter: AttributeFilter): ReferenceCriterion[] {
    return attributeFilter
      .getReference()
      .getSelectedReferenceIds()
      .reduce((acc, id) => {
        try {
          acc.push(this.referenceCriterionProvider.getOne(id));
        } catch {
          // not yet in provider
        }
        return acc;
      }, [] as ReferenceCriterion[]);
  }

  public trackByAttributeCode(_index: number, attributeFilter: AttributeFilter): string {
    return attributeFilter.getAttributeCode()?.getCode() ?? String(_index);
  }
}
