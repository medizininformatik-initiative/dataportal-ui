import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { CloneAttributeFilter } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/CloneAttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { EditCriterionService } from 'src/app/service/Criterion/Edit/EditCriterion.service'
import { ReferenceCriterionProviderService } from 'src/app/service/Provider/ReferenceCriterionProvider.service'
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
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { CriterionHeaderComponent } from './header/criterion-header.component'
import { FilterTabsComponent } from '../filter-tabs/filter-tabs.component'
import { EditTimeRestrictionComponent } from '../../../../feasibility-query/components/editor/criterion-modal/time-restriction/edit-time-restriction.component'
import { ConceptComponent } from '../../../../feasibility-query/components/editor/criterion-modal/concept/concept.component'
import { TermcodeComponent } from '../../../../feasibility-query/components/editor/criterion-modal/termCode/termcode.component'
import { QuantityComponent } from '../../../../feasibility-query/components/editor/criterion-modal/quantity/quantity.component'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'
import { ReferenceComponent } from 'src/app/modules/feasibility-query/components/editor/reference/reference.component'

@Component({
  selector: 'num-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.scss'],
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
    ReferenceComponent,
  ],
})
export class CriterionComponent implements AfterViewInit, OnDestroy {
  private criterionEditService = inject(EditCriterionService)
  private cdr = inject(ChangeDetectorRef)
  private referenceCriterionProvider = inject(ReferenceCriterionProviderService)

  readonly criterion = input.required<Criterion>()

  readonly attributeFilters = computed<AbstractAttributeFilters[]>(() =>
    this.criterion().getConceptAttributeFilters()
  )

  readonly referenceFilter = computed<AbstractAttributeFilters[]>(() =>
    this.criterion().getReferenceAttributeFilters()
  )

  readonly conceptValueFilter = computed<ValueFilter[]>(() =>
    this.criterion().getConceptValueFilters()
  )

  readonly conceptAttributeFilter = computed<AttributeFilter[]>(() =>
    CloneAttributeFilter.deepCopyAttributeFilters(this.criterion().getConceptAttributeFilters())
  )

  readonly quantityValueFilter = computed<ValueFilter[]>(() =>
    this.criterion().getQuantityValueFilters()
  )

  readonly quantityAttributeFilter = computed<AttributeFilter[]>(() =>
    this.criterion().getQuantityAttributeFilters()
  )

  readonly timeRestrictionTemplate = viewChild('timeRestriction', { read: TemplateRef })

  readonly conceptAttributeFiltersTemplate = viewChild('conceptAttributeFilterTemplate', {
    read: TemplateRef,
  })

  readonly conceptValueFiltersTemplate = viewChild('conceptValueFiltersTemplate', {
    read: TemplateRef,
  })

  readonly termCodesTemplate = viewChild('termCodes', { read: TemplateRef })

  readonly referenceTemplate = viewChild('reference', { read: TemplateRef })

  readonly quantityAttributeFilterTemplate = viewChild('quantityAttributeFilterTemplate', {
    read: TemplateRef,
  })

  readonly quantityValueFilterTemplate = viewChild('quantityValueFilterTemplate', {
    read: TemplateRef,
  })

  templates: any[] = []
  private readonly viewInitialized = signal(false)

  referenceSubscription: Subscription | undefined = undefined

  constructor() {
    effect(() => {
      this.criterionEditService.initialize(this.criterion())
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

    this.setTermCodesTemplate(templates)
    this.setConceptAttributeFilterTemplate(templates)
    this.setConceptValueFilterTemplate(templates)
    this.setQuantityAttributeFilterTemplate(templates)
    this.setQuantityValueFilterTemplate(templates)
    this.setReferenceTemplate(templates)
    this.setTimeRestrictionTemplate(templates)

    return templates
  }

  private setTimeRestrictionTemplate(templates: any[]): void {
    if (this.criterion().getTimeRestriction()) {
      templates.push({ template: this.timeRestrictionTemplate(), name: 'TIMERESTRICTION' })
    }
  }

  private setTermCodesTemplate(templates: any[]): void {
    if (this.criterion().getTermCodes().length > 1) {
      templates.push({ template: this.termCodesTemplate(), name: 'TERMCODE' })
    }
  }

  private setReferenceTemplate(templates: any[]): void {
    if (this.referenceFilter().length > 0) {
      templates.push({ template: this.referenceTemplate(), name: 'REFERENCE' })
    }
  }

  private setQuantityValueFilterTemplate(templates: any[]): void {
    if (this.quantityValueFilter().length > 0) {
      templates.push({
        template: this.quantityValueFilterTemplate(),
        display: this.quantityValueFilter()[0].getDisplay(),
      })
    }
  }

  private setQuantityAttributeFilterTemplate(templates: any[]): void {
    if (this.quantityAttributeFilter().length > 0) {
      templates.push({
        template: this.quantityAttributeFilterTemplate(),
        display: this.quantityAttributeFilter()[0].getDisplay(),
      })
    }
  }

  private setConceptValueFilterTemplate(templates: any[]): void {
    if (this.conceptValueFilter().length > 0) {
      templates.push({
        template: this.conceptValueFiltersTemplate(),
        display: this.conceptValueFilter()[0].getDisplay(),
      })
    }
  }

  private setConceptAttributeFilterTemplate(templates: any[]): void {
    this.conceptAttributeFilter().forEach((filter, index) => {
      templates.push({
        template: this.conceptAttributeFiltersTemplate(),
        display: filter.getDisplay(),
        context: { $implicit: index },
      })
    })
  }

  public updateConceptAttributeFilter(
    conceptFilter: ConceptFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.criterionEditService.updateConceptAttributeFilter(conceptFilter, attributeFilter)
  }

  public updateQuantityAttributeFilter(
    quantityFilter: AbstractQuantityFilter,
    attributeFilter: AttributeFilter
  ): void {
    this.criterionEditService.updateQuantityAttributeFilter(quantityFilter, attributeFilter)
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    this.criterionEditService.updateTimeRestriction(timeRestriction)
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    this.criterionEditService.updateTermCodes(termCodes)
  }

  public updateReferenceFilter(id: string, attributeFilter: AttributeFilter): void {
    this.referenceSubscription?.unsubscribe()
    this.referenceSubscription = this.criterionEditService
      .addReferenceCriteria(id, attributeFilter)
      .subscribe()
  }

  public updateQuantityValueFilter(quantityFilter: AbstractQuantityFilter): void {
    this.criterionEditService.updateQuantityValueFilter(quantityFilter)
  }

  public updateConceptValueFilter(conceptFilter: ConceptFilter): void {
    this.criterionEditService.updateConceptValueFilter(conceptFilter)
  }

  public updateSelectedReferences(
    attributeFilter: AttributeFilter,
    updatedReferences: ReferenceCriterion[]
  ): void {
    this.criterionEditService.updateSelectedReferences(attributeFilter, updatedReferences)
  }

  public resolveReferenceCriteria(attributeFilter: AttributeFilter): ReferenceCriterion[] {
    return attributeFilter
      .getReference()
      .getSelectedReferenceIds()
      .reduce((acc, id) => {
        try {
          acc.push(this.referenceCriterionProvider.getOne(id))
        } catch {
          // not yet in provider
        }
        return acc
      }, [] as ReferenceCriterion[])
  }

  public trackByAttributeCode(_index: number, attributeFilter: AttributeFilter): string {
    return attributeFilter.getAttributeCode()?.getCode() ?? String(_index)
  }
}
