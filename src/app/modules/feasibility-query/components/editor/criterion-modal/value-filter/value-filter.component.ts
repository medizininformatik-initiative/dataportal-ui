import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { ConceptComponent } from '../concept/concept.component'
import { QuantityComponent } from '../quantity/quantity.component'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-value-filter',
  templateUrl: './value-filter.component.html',
  styleUrls: ['./value-filter.component.scss'],
  standalone: true,
  imports: [ConceptComponent, QuantityComponent, DisplayTranslationPipe],
})
export class ValueFilterComponent implements OnInit {
  @Input()
  valueFilter: ValueFilter

  @Output()
  valueFilterChange = new EventEmitter<ValueFilter>()

  public ngOnInit(): void {}

  public updateConceptFilter(conceptFilter: ConceptFilter) {
    const newValueFilter = new ValueFilter(
      this.valueFilter.getDisplay(),
      FilterTypes.CONCEPT,
      conceptFilter,
      this.valueFilter.getQuantity(),
      this.valueFilter.getOptional()
    )
    this.valueFilterChange.emit(newValueFilter)
  }

  public updateQuantityFilter(quantityFilter: AbstractQuantityFilter) {
    const newValueFilter = new ValueFilter(
      this.valueFilter.getDisplay(),
      FilterTypes.QUANTITY,
      this.valueFilter.getConcept(),
      quantityFilter,
      this.valueFilter.getOptional()
    )
    this.valueFilterChange.emit(newValueFilter)
  }
}
