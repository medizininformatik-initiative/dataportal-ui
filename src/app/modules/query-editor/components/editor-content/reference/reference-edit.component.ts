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
  OnDestroy,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal,
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
export class ReferenceEditComponent implements AfterViewInit, OnDestroy {
  private referenceCriterionEditService = inject(EditReferenceCriterionService)
  private cdr = inject(ChangeDetectorRef)

  readonly referenceCriterion = input<ReferenceCriterion>()

  readonly attributeFilters = computed<AbstractAttributeFilters[]>(() =>
    this.referenceCriterion().getConceptAttributeFilters()
  )

  readonly referenceFilter = computed<AbstractAttributeFilters[]>(() =>
    this.referenceCriterion().getReferenceAttributeFilters()
  )

  readonly conceptValueFilter = computed<ValueFilter[]>(() =>
    this.referenceCriterion().getConceptValueFilters()
  )

  readonly conceptAttributeFilter = computed<AttributeFilter[]>(() =>
    CloneAttributeFilter.deepCopyAttributeFilters(
      this.referenceCriterion().getConceptAttributeFilters()
    )
  )

  readonly quantityValueFilter = computed<ValueFilter[]>(() =>
    this.referenceCriterion().getQuantityValueFilters()
  )

  readonly quantityAttributeFilter = computed<AttributeFilter[]>(() =>
    this.referenceCriterion().getQuantityAttributeFilters()
  )

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

  private readonly viewInitialized = signal(false)

  referenceSubscription: Subscription | undefined = undefined

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    effect(() => {
      this.referenceCriterionEditService.initialize(this.referenceCriterion())
    })

    effect(() => {
      if (!this.viewInitialized()) {
        return
      }
      this.templates = this.buildTemplates()
      this.cdr.markForCheck()
    })
  }

  ngOnDestroy(): void {
    this.referenceSubscription?.unsubscribe()
  }

  ngAfterViewInit() {
    this.viewInitialized.set(true)
    this.cdr.detectChanges()
  }

  private buildTemplates(): any[] {
    const templates: any[] = []
    this.setConceptAttributeFilterTemplate(templates)
    this.setConceptValueFilterTemplate(templates)
    this.setQuantityAttributeFilterTemplate(templates)
    this.setQuantityValueFilterTemplate(templates)
    this.setTermCodesTemplate(templates)
    this.setTimeRestrictionTemplate(templates)
    return templates
  }

  private setTimeRestrictionTemplate(templates: any[]): void {
    if (this.referenceCriterion().getTimeRestriction()) {
      templates.push({ template: this.timeRestrictionTemplate, name: 'TIMERESTRICTION' })
    }
  }

  private setTermCodesTemplate(templates: any[]): void {
    if (this.referenceCriterion().getTermCodes().length > 1) {
      templates.push({ template: this.termCodesTemplate, name: 'TERMCODE' })
    }
  }

  private setQuantityValueFilterTemplate(templates: any[]): void {
    if (this.quantityValueFilter().length > 0) {
      templates.push({ template: this.quantityValueFilterTemplate, name: 'QUANTITY' })
    }
  }

  private setQuantityAttributeFilterTemplate(templates: any[]): void {
    if (this.quantityAttributeFilter().length > 0) {
      templates.push({ template: this.quantityAttributeFilterTemplate, name: 'QUANTITY' })
    }
  }

  private setConceptValueFilterTemplate(templates: any[]): void {
    if (this.conceptValueFilter().length > 0) {
      templates.push({ template: this.conceptValueFiltersTemplate, name: 'CONCEPT' })
    }
  }

  private setConceptAttributeFilterTemplate(templates: any[]): void {
    this.conceptAttributeFilter().forEach((filter, index) => {
      const display = filter.getDisplay()
      templates.push({
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
