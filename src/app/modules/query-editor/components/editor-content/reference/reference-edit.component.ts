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
import { Subscription } from 'rxjs'
import { AbstractAttributeFilters } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AbstractAttributeFilters'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CloneAttributeFilter } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/CloneAttributeFilter'
import { EditReferenceCriterionService } from 'src/app/service/Criterion/Edit/EditReferenceCriterion.service'
import { DisplayTranslationPipe } from '../../../../../shared/pipes/DisplayTranslationPipe'
import { ConceptComponent } from '../../../../feasibility-query/components/editor/criterion-modal/concept/concept.component'
import { QuantityComponent } from '../../../../feasibility-query/components/editor/criterion-modal/quantity/quantity.component'
import { TermcodeComponent } from '../../../../feasibility-query/components/editor/criterion-modal/termCode/termcode.component'
import { EditTimeRestrictionComponent } from '../../../../feasibility-query/components/editor/criterion-modal/time-restriction/edit-time-restriction.component'
import { CriterionHeaderComponent } from '../criterion/header/criterion-header.component'
import { FilterTabsComponent } from '../filter-tabs/filter-tabs.component'

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
  private readonly referenceCriterionEditService = inject(EditReferenceCriterionService)
  private readonly cdr = inject(ChangeDetectorRef)

  public readonly referenceCriterion = input<ReferenceCriterion>()

  public readonly attributeFilters = computed<AbstractAttributeFilters[]>(() => this.referenceCriterion().getConceptAttributeFilters())

  public readonly referenceFilter = computed<AbstractAttributeFilters[]>(() => this.referenceCriterion().getReferenceAttributeFilters())

  public readonly conceptValueFilter = computed<ValueFilter[]>(() => this.referenceCriterion().getConceptValueFilters())

  public readonly conceptAttributeFilter = computed<AttributeFilter[]>(() =>
    CloneAttributeFilter.deepCopyAttributeFilters(this.referenceCriterion().getConceptAttributeFilters())
  )

  public readonly quantityValueFilter = computed<ValueFilter[]>(() => this.referenceCriterion().getQuantityValueFilters())

  public readonly quantityAttributeFilter = computed<AttributeFilter[]>(() => this.referenceCriterion().getQuantityAttributeFilters())

  public readonly timeRestrictionTemplate = viewChild('timeRestriction', { read: TemplateRef })

  public readonly conceptAttributeFiltersTemplate = viewChild('conceptAttributeFilterTemplate', {
    read: TemplateRef,
  })

  public readonly conceptValueFiltersTemplate = viewChild('conceptValueFilterTemplate', {
    read: TemplateRef,
  })

  public readonly termCodesTemplate = viewChild('termCodes', { read: TemplateRef })

  public readonly quantityAttributeFilterTemplate = viewChild('quantityAttributeFilterTemplate', {
    read: TemplateRef,
  })

  public readonly quantityValueFilterTemplate = viewChild('quantityValueFilterTemplate', {
    read: TemplateRef,
  })

  public templates: any[] = []

  private readonly viewInitialized = signal(false)

  public referenceSubscription: Subscription | undefined = undefined

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

  public ngOnDestroy(): void {
    this.referenceSubscription?.unsubscribe()
  }

  public ngAfterViewInit() {
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
      templates.push({ template: this.timeRestrictionTemplate(), name: 'TIMERESTRICTION' })
    }
  }

  private setTermCodesTemplate(templates: any[]): void {
    if (this.referenceCriterion().getTermCodes().length > 1) {
      templates.push({ template: this.termCodesTemplate(), name: 'TERMCODE' })
    }
  }

  private setQuantityValueFilterTemplate(templates: any[]): void {
    if (this.quantityValueFilter().length > 0) {
      templates.push({ template: this.quantityValueFilterTemplate(), name: 'QUANTITY' })
    }
  }

  private setQuantityAttributeFilterTemplate(templates: any[]): void {
    if (this.quantityAttributeFilter().length > 0) {
      templates.push({ template: this.quantityAttributeFilterTemplate(), name: 'QUANTITY' })
    }
  }

  private setConceptValueFilterTemplate(templates: any[]): void {
    if (this.conceptValueFilter().length > 0) {
      templates.push({ template: this.conceptValueFiltersTemplate(), name: 'CONCEPT' })
    }
  }

  private setConceptAttributeFilterTemplate(templates: any[]): void {
    this.conceptAttributeFilter().forEach((filter, index) => {
      const display = filter.getDisplay()
      templates.push({
        template: this.conceptAttributeFiltersTemplate(),
        display,
        context: { $implicit: index },
      })
    })
  }

  public updateConceptAttributeFilter(conceptFilter: ConceptFilter, attributeFilter: AttributeFilter): void {
    this.referenceCriterionEditService.updateConceptAttributeFilter(conceptFilter, attributeFilter)
  }

  public updateQuantityAttributeFilter(quantityFilter: AbstractQuantityFilter, attributeFilter: AttributeFilter): void {
    this.referenceCriterionEditService.updateQuantityAttributeFilter(quantityFilter, attributeFilter)
  }

  public updateTimeRestriction(timeRestriction: AbstractTimeRestriction): void {
    this.referenceCriterionEditService.updateTimeRestriction(timeRestriction)
  }

  public updateTermCodes(termCodes: TerminologyCode[]): void {
    this.referenceCriterionEditService.updateTermCodes(termCodes)
  }

  public updateReferenceFilter(id: string, attributeFilter: AttributeFilter): void {
    this.referenceSubscription?.unsubscribe()
    this.referenceSubscription = this.referenceCriterionEditService.addReferenceCriteria(id, attributeFilter).subscribe()
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
