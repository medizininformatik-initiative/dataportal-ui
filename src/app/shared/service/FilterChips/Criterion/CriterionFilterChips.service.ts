import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion'
import { BehaviorSubject, Observable } from 'rxjs'
import { ConceptFilterChipService } from './ConceptFilterChipService.service'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { Injectable, inject } from '@angular/core'
import { QuantityFilterChipService } from './QuantityFilterChipService.service'
import { TerminologyCodeChipService } from './TerminologyCodeChip.service'
import { TimeRestrictionChipService } from './TimeRestrictionChip.service'
import { ReferenceFilterChipService } from './ReferenceFilterChip.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionFilterChipService {
  private conceptFilterChipService = inject(ConceptFilterChipService)
  private quantityFilterChipService = inject(QuantityFilterChipService)
  private timeRestrictionChipService = inject(TimeRestrictionChipService)
  private terminologyCodeChipService = inject(TerminologyCodeChipService)
  private referenceFilterChipService = inject(ReferenceFilterChipService)

  private filterChipsSubject: BehaviorSubject<FilterChipData[]> = new BehaviorSubject<
    FilterChipData[]
  >([])
  filterChips$: Observable<FilterChipData[]> = this.filterChipsSubject.asObservable()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public generateFilterChipsFromCriterion(
    criterion: AbstractCriterion,
    includeReferenceChips = false
  ): Observable<FilterChipData[]> {
    this.filterChipsSubject.next([])

    const conceptChips = this.generateConceptChips(criterion)
    const quantityChips = this.generateQuantityChips(criterion)
    const termcodeChips =
      criterion.getTermCodes().length > 1 ? this.generateTermcodeChips(criterion) : []
    const timeRestrictionChips = this.timeRestrictionChipService.generateTimeRestrictionChips(
      criterion.getTimeRestriction()
    )
    const allChips = [...conceptChips, ...quantityChips, ...termcodeChips, ...timeRestrictionChips]
    if (includeReferenceChips) {
      allChips.push(...this.referenceFilterChipService.generateReferenceChips(criterion))
    }
    const filteredChips = allChips.filter((chip) => chip !== undefined)
    this.filterChipsSubject.next(filteredChips)
    return this.filterChipsSubject.asObservable()
  }

  public generateConceptChips(criterion: AbstractCriterion): FilterChipData[] {
    const attributeFilters = criterion.getAttributeFilters()
    const valueFilters = criterion.getValueFilters()

    const attributeChips =
      this.conceptFilterChipService.generateConceptChipsFromAttributeFilters(attributeFilters)
    const valueChips =
      this.conceptFilterChipService.generateConceptChipsFromValueFilters(valueFilters)

    return [...attributeChips, ...valueChips]
  }

  public generateQuantityChips(criterion: AbstractCriterion): FilterChipData[] {
    const attributeFilters = criterion.getAttributeFilters()
    const valueFilters = criterion.getValueFilters()
    if (attributeFilters.length > 0) {
      return (
        this.quantityFilterChipService.generateQuantityChipsFromAttributeFilters(
          attributeFilters
        ) ?? []
      )
    } else if (valueFilters.length > 0) {
      return (
        this.quantityFilterChipService.generateQuantityChipsFromValueFilters(valueFilters) ?? []
      )
    } else {
      return []
    }
  }

  public generateTermcodeChips(criterion: Criterion): FilterChipData[] {
    const termCodeLength = criterion.getTermCodes().length
    if (termCodeLength <= 1) {
      return []
    }
    return [this.terminologyCodeChipService.generateTermcodeChipsFromCriterion(criterion)]
  }

  public buildTimeRestrictionChips(criterion: AbstractCriterion): FilterChipData[] {
    return this.timeRestrictionChipService.generateTimeRestrictionChips(
      criterion.getTimeRestriction()
    )
  }

  public createReferenceChips(criterion: AbstractCriterion): FilterChipData[] {
    return this.referenceFilterChipService.generateReferenceChips(criterion)
  }
}
