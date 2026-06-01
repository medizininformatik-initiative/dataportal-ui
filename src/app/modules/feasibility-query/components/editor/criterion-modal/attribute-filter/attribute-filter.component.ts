import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { Component, input, output } from '@angular/core'
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
export class AttributeFilterComponent {
  readonly attributeFilter = input<AttributeFilter>()
  readonly attributeFilterChange = output<AttributeFilter>()

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
    const filter = this.attributeFilter()
    const updated = new AttributeFilter(
      filter.getDisplay(),
      type,
      filter.getAttributeCode(),
      conceptFilter,
      quantityFilter,
      undefined,
      filter.getOptional()
    )
    this.attributeFilterChange.emit(updated)
  }
}
