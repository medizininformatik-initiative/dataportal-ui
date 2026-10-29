import { Component, model } from '@angular/core'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { ConceptComponent } from '../concept/concept.component'
import { QuantityComponent } from '../quantity/quantity.component'

@Component({
  selector: 'num-value-filter',
  templateUrl: './value-filter.component.html',
  styleUrls: ['./value-filter.component.scss'],
  standalone: true,
  imports: [ConceptComponent, QuantityComponent, DisplayTranslationPipe],
})
export class ValueFilterComponent {
  public readonly valueFilter = model.required<ValueFilter>()

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
