import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { SectionNameComponent } from '../../../../../../shared/components/section-name/section-name.component'
import { QuantityComparisionSelectComponent } from './quantity-comparision-select/quantity-comparision-select.component'
import { QuantityRangeComponent } from './quantity-range/quantity-range.component'
import { QuantityComparatorComponent } from './quantity-comparator/quantity-comparator.component'
import { AllowedUnitsComponent } from './allowed-units/allowed-units.component'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SectionNameComponent,
    QuantityComparisionSelectComponent,
    QuantityRangeComponent,
    QuantityComparatorComponent,
    AllowedUnitsComponent,
    DisplayTranslationPipe,
  ],
})
export class QuantityComponent implements OnInit {
  private quantityFilterFactoryService = inject(QuantityFilterFactoryService)

  FilterTypes: typeof FilterTypes = FilterTypes

  readonly quantityFilter = input<AbstractQuantityFilter>()

  readonly quantityFilterChange = output<AbstractQuantityFilter>()

  readonly display = input<Display>()
  /**
   * UI conditions
   */

  /**
   * UI conditions
   */
  isQuantityNotSet = false
  isBetweenFilter = false
  isComparatorFilter = false

  /**
   * QuantityFilter Instances
   */
  quantityComparatorFilter: QuantityComparatorFilter | undefined = undefined
  quantityRangeFilter: QuantityRangeFilter | undefined = undefined

  selectedQuantityFilterComparator!: QuantityComparisonOption

  selectedQuantityFilterUnit: QuantityUnit | undefined = undefined

  QuantityComparisonOption: typeof QuantityComparisonOption = QuantityComparisonOption

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit() {
    this.setupFactoryService()
    this.initializaFilterType()
    this.initializeUnit()
    this.selectedQuantityFilterComparator = this.quantityFilter().getComparator()
  }

  private setupFactoryService() {
    this.quantityFilterFactoryService.setAllowedUnits(this.quantityFilter().getAllowedUnits())
    this.quantityFilterFactoryService.setPrecision(this.quantityFilter().getPrecision())
  }

  private initializaFilterType() {
    const type: FilterTypes = this.quantityFilter().getType()
    if (type === FilterTypes.QUANTITY_COMPARATOR) {
      this.quantityComparatorFilter = this.quantityFilter() as QuantityComparatorFilter
      this.isComparatorFilter = true
    }
    if (type === FilterTypes.QUANTITY_RANGE) {
      this.quantityRangeFilter = this.quantityFilter() as QuantityRangeFilter
      this.isBetweenFilter = true
    }
    if (type === FilterTypes.QUANTITY_NOT_SET) {
      this.isQuantityNotSet = true
    }
  }

  private initializeUnit() {
    if (this.quantityFilter().getSelectedUnit()) {
      this.setSelectQuantityFilterUnit(this.quantityFilter().getSelectedUnit())
    } else {
      this.setSelectQuantityFilterUnit(this.quantityFilter().getAllowedUnits()[0])
    }
  }

  public setSelectedQuantityFilterOption(option: QuantityComparisonOption): void {
    this.selectedQuantityFilterComparator =
      QuantityComparisonOption[option as keyof typeof QuantityComparisonOption]
    if (option === QuantityComparisonOption.NONE) {
      const emptyQuantityFilter = this.quantityFilterFactoryService.createEmptyQuantityFilter()
      this.updateConditions()
      this.quantityFilterChange.emit(emptyQuantityFilter)
    }
    this.updateConditions()
  }

  private updateConditions() {
    this.isBetweenFilter =
      this.selectedQuantityFilterComparator === QuantityComparisonOption.BETWEEN
    this.isComparatorFilter =
      this.selectedQuantityFilterComparator !== QuantityComparisonOption.BETWEEN &&
      this.selectedQuantityFilterComparator !== QuantityComparisonOption.NONE
    this.isQuantityNotSet = this.selectedQuantityFilterComparator === QuantityComparisonOption.NONE
  }

  public setSelectQuantityFilterUnit(selectedUnit: QuantityUnit) {
    this.selectedQuantityFilterUnit = selectedUnit
    this.quantityFilterFactoryService.setQuantityUnit(selectedUnit)
  }

  public emitQuantityFilterInstance(quantityFilter: AbstractQuantityFilter) {
    this.quantityFilterChange.emit(quantityFilter)
  }
}
