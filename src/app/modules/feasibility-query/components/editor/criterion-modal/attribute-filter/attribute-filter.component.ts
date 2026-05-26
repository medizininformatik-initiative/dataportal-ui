import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { ConceptComponent } from '../concept/concept.component'
import { QuantityComponent } from '../quantity/quantity.component'

@Component({
  selector: 'num-attribute-filter',
  templateUrl: './attribute-filter.component.html',
  styleUrls: ['./attribute-filter.component.scss'],
  standalone: true,
  imports: [ConceptComponent, QuantityComponent],
})
export class AttributeFilterComponent implements OnInit {
  @Input() attributeFilter: AttributeFilter
  @Output() attributeFilterChange = new EventEmitter<AttributeFilter>()

  ngOnInit(): void {}

  public updateConceptFilter(conceptFilter: ConceptFilter): void {
    this.emitUpdatedFilter(FilterTypes.CONCEPT, conceptFilter, undefined)
  }

  public updateQuantityFilter(quantityFilter: AbstractQuantityFilter): void {
    this.emitUpdatedFilter(FilterTypes.QUANTITY, undefined, quantityFilter)
  }

  private emitUpdatedFilter(
    type: FilterTypes,
    conceptFilter?: ConceptFilter,
    quantityFilter?: AbstractQuantityFilter
  ): void {
    const updated = new AttributeFilter(
      this.attributeFilter.getDisplay(),
      type,
      this.attributeFilter.getAttributeCode(),
      conceptFilter,
      quantityFilter,
      undefined,
      this.attributeFilter.getOptional()
    )
    this.attributeFilterChange.emit(updated)
  }
}
