import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CloneAttributeFilter } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/CloneAttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { EditReferenceCriterionService } from 'src/app/service/Criterion/Edit/EditReferenceCriterion.service'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { Subscription } from 'rxjs'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
  input,
} from '@angular/core'
import { CriterionHeaderComponent } from '../criterion/header/criterion-header.component'
import { FilterTabsComponent } from '../filter-tabs/filter-tabs.component'
import { EditTimeRestrictionComponent } from '../../../../feasibility-query/components/editor/criterion-modal/time-restriction/edit-time-restriction.component'
import { ConceptComponent } from '../../../../feasibility-query/components/editor/criterion-modal/concept/concept.component'
import { TermcodeComponent } from '../../../../feasibility-query/components/editor/criterion-modal/termCode/termcode.component'
import { QuantityComponent } from '../../../../feasibility-query/components/editor/criterion-modal/quantity/quantity.component'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-reference-edit',
  templateUrl: './reference-edit.component.html',
  styleUrls: ['./reference-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CriterionHeaderComponent,
    FilterTabsComponent,
    EditTimeRestrictionComponent,
    ConceptComponent,
    TermcodeComponent,
    QuantityComponent,
    DisplayTranslationPipe,
  ],
})
export class ReferenceEditComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private referenceCriterionEditService = inject(EditReferenceCriterionService)
  private cdr = inject(ChangeDetectorRef)

  readonly referenceCriterion = input<ReferenceCriterion>()

  attributeFilters: AbstractAttributeFilters[] = []

  referenceFilter: AbstractAttributeFilters[] = []

  conceptValueFilter: ValueFilter[] = []

  conceptAttributeFilter: AttributeFilter[] = []

  quantityValueFilter: ValueFilter[] = []

  quantityAttributeFilter: AttributeFilter[] = []

  @ViewChild('timeRestriction', { static: false, read: TemplateRef })
  timeRestrictionTemplate: TemplateRef<any> | undefined = undefined

  @ViewChild('conceptAttributeFilterTemplate', { static: false, read: TemplateRef })
  conceptAttributeFiltersTemplate: TemplateRef<any> | undefined = undefined

  @ViewChild('conceptValueFilterTemplate', { static: false, read: TemplateRef })
  conceptValueFiltersTemplate: TemplateRef<any> | undefined = undefined

  @ViewChild('termCodes', { static: false, read: TemplateRef })
  termCodesTemplate: TemplateRef<any> | undefined = undefined

  @ViewChild('quantityAttributeFilterTemplate', { static: false, read: TemplateRef })
  quantityAttributeFilterTemplate: TemplateRef<any> | undefined = undefined

  @ViewChild('quantityValueFilterTemplate', { static: false, read: TemplateRef })
  quantityValueFilterTemplate: TemplateRef<any> | undefined = undefined

  templates: any[] = []

  referenceSubscription: Subscription | undefined = undefined

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.initializeFromCriterion()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeFromCriterion()
  }

  ngOnDestroy(): void {
    this.referenceSubscription?.unsubscribe()
  }

  private initializeFromCriterion(): void {
    const referenceCriterion = this.referenceCriterion()
    this.referenceCriterionEditService.initialize(referenceCriterion)
    this.attributeFilters = referenceCriterion.getConceptAttributeFilters()
    this.referenceFilter = referenceCriterion.getReferenceAttributeFilters()
    this.quantityAttributeFilter = referenceCriterion.getQuantityAttributeFilters()
    this.quantityValueFilter = referenceCriterion.getQuantityValueFilters()
    this.conceptAttributeFilter = CloneAttributeFilter.deepCopyAttributeFilters(
      referenceCriterion.getConceptAttributeFilters()
    )
    this.conceptValueFilter = referenceCriterion.getConceptValueFilters()
  }

  ngAfterViewInit() {
    this.templates = []
    this.buildTemplates()
    this.cdr.detectChanges()
  }

  private buildTemplates(): void {
    this.setConceptAttributeFilterTemplate()
    this.setConceptValueFilterTemplate()
    this.setQuantityAttributeFilterTemplate()
    this.setQuantityValueFilterTemplate()
    this.setTermCodesTemplate()
    this.setTimeRestrictionTemplate()
  }

  private setTimeRestrictionTemplate(): void {
    if (this.referenceCriterion().getTimeRestriction()) {
      this.templates.push({ template: this.timeRestrictionTemplate, name: 'TIMERESTRICTION' })
    }
  }

  private setTermCodesTemplate(): void {
    if (this.referenceCriterion().getTermCodes().length > 1) {
      this.templates.push({ template: this.termCodesTemplate, name: 'TERMCODE' })
    }
  }

  private setQuantityValueFilterTemplate(): void {
    if (this.quantityValueFilter.length > 0) {
      this.templates.push({ template: this.quantityValueFilterTemplate, name: 'QUANTITY' })
    }
  }

  private setQuantityAttributeFilterTemplate(): void {
    if (this.quantityAttributeFilter.length > 0) {
      this.templates.push({ template: this.quantityAttributeFilterTemplate, name: 'QUANTITY' })
    }
  }

  private setConceptValueFilterTemplate(): void {
    if (this.conceptValueFilter.length > 0) {
      this.templates.push({ template: this.conceptValueFiltersTemplate, name: 'CONCEPT' })
    }
  }

  private setConceptAttributeFilterTemplate(): void {
    this.conceptAttributeFilter.forEach((filter, index) => {
      const display = filter.getDisplay()
      this.templates.push({
        template: this.conceptAttributeFiltersTemplate,
        display,
        context: { $implicit: index },
      })
    })
  }

  public updateConceptAttributeFilter(
    conceptFilter: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.referenceCriterionEditService.updateConceptAttributeFilter(conceptFilter, attributeFilter)
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.referenceCriterionEditService.updateQuantityAttributeFilter(
      quantityFilter,
      attributeFilter
    )
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    this.referenceCriterionEditService.updateTimeRestriction(timeRestriction)
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    this.referenceCriterionEditService.updateTermCodes(termCodes)
  }

  public updateReferenceFilter(id: string, attributeFilter: AttributeFilter): void {
    this.referenceSubscription?.unsubscribe()
    this.referenceSubscription = this.referenceCriterionEditService
      .addReferenceCriteria(id, attributeFilter)
      .subscribe()
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    this.referenceCriterionEditService.updateQuantityValueFilter(quantityFilter)
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    this.referenceCriterionEditService.updateConceptValueFilter(conceptFilter)
  }

  public trackByAttributeCode(_index: number, attributeFilter: AttributeFilter): string {
    return attributeFilter.getAttributeCode()?.getCode() ?? String(_index)
  }
}
