import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { Component, model } from '@angular/core'
import { ConceptComponent } from '../concept/concept.component'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComponent } from '../quantity/quantity.component'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'

@Component({
  selector: 'num-value-filter',
  templateUrl: './value-filter.component.html',
  styleUrls: ['./value-filter.component.scss'],
  standalone: true,
  imports: [ConceptComponent, QuantityComponent, DisplayTranslationPipe],
})
export class ValueFilterComponent {
  readonly valueFilter = model.required<ValueFilter>()

  public updateConceptFilter(conceptFilter: ConceptFilter) {
    const newValueFilter = new ValueFilter(
      this.valueFilter().getDisplay(),
      FilterTypes.CONCEPT,
      conceptFilter,
      this.valueFilter().getQuantity(),
      this.valueFilter().getOptional()
    )
    this.valueFilter.set(newValueFilter)
  }

  public updateQuantityFilter(quantityFilter: AbstractQuantityFilter) {
    const newValueFilter = new ValueFilter(
      this.valueFilter().getDisplay(),
      FilterTypes.QUANTITY,
      this.valueFilter().getConcept(),
      quantityFilter,
      this.valueFilter().getOptional()
    )
    this.valueFilter.set(newValueFilter)
  }
}
