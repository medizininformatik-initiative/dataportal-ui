import { AbstractCriterion } from 'src/app/model/FeasibilityQuery/Criterion/AbstractCriterion';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConceptFilterChipService } from './ConceptFilterChipService.service';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { Injectable } from '@angular/core';
import { InterfaceFilterChip } from '../../../models/FilterChips/InterfaceFilterChip';
import { QuantityFilterChipService } from './QuantityFilterChipService.service';
import { TerminologyCodeChipService } from './TerminologyCodeChip.service';
import { TimeRestrictionChipService } from './TimeRestrictionChip.service';

@Injectable({
  providedIn: 'root',
})
export class CriterionFilterChipService {
  private filterChipsSubject: BehaviorSubject<InterfaceFilterChip[]> = new BehaviorSubject<
    InterfaceFilterChip[]
  >([]);
  filterChips$: Observable<InterfaceFilterChip[]> = this.filterChipsSubject.asObservable();

  constructor(
    private conceptFilterChipService: ConceptFilterChipService,
    private quantityFilterChipService: QuantityFilterChipService,
    private timeRestrictionChipService: TimeRestrictionChipService,
    private terminologyCodeChipService: TerminologyCodeChipService
  ) {}

  public generateFilterChipsFromCriterion(
    criterion: AbstractCriterion
  ): Observable<InterfaceFilterChip[]> {
    this.filterChipsSubject.next([]);

    const conceptChips = this.generateConceptChips(criterion);
    const quantityChips = this.generateQuantityChips(criterion);
    const termcodeChips =
      criterion.getTermCodes().length > 1 ? [this.generateTermcodeChips(criterion)] : [];
    const timeRestrictionChips = this.timeRestrictionChipService.generateTimeRestrictionChips(
      criterion.getTimeRestriction()
    );
    const allChips = [...conceptChips, ...quantityChips, ...termcodeChips, ...timeRestrictionChips];
    const filteredChips = allChips.filter((chip) => chip !== undefined);
    this.filterChipsSubject.next(filteredChips);

    return this.filterChipsSubject.asObservable();
  }

  private generateConceptChips(criterion: AbstractCriterion): InterfaceFilterChip[] {
    const attributeFilters = criterion.getAttributeFilters();
    const valueFilters = criterion.getValueFilters();

    const attributeChips =
      this.conceptFilterChipService.generateConceptChipsFromAttributeFilters(attributeFilters);
    const valueChips =
      this.conceptFilterChipService.generateConceptChipsFromValueFilters(valueFilters);

    return [...attributeChips, ...valueChips];
  }

  private generateQuantityChips(criterion: AbstractCriterion): InterfaceFilterChip[] {
    const attributeFilters = criterion.getAttributeFilters();
    const valueFilters = criterion.getValueFilters();
    if (attributeFilters.length > 0) {
      return (
        this.quantityFilterChipService.generateQuantityChipsFromAttributeFilters(
          attributeFilters
        ) ?? []
      );
    } else if (valueFilters.length > 0) {
      return (
        this.quantityFilterChipService.generateQuantityChipsFromValueFilters(valueFilters) ?? []
      );
    } else {
      return [];
    }
  }

  private generateTermcodeChips(criterion: Criterion): InterfaceFilterChip {
    return this.terminologyCodeChipService.generateTermcodeChipsFromCriterion(criterion);
  }
}
