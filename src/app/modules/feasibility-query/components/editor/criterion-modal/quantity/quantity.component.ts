import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service'
import { AllowedUnitsComponent } from './allowed-units/allowed-units.component'
import { QuantityComparatorComponent } from './quantity-comparator/quantity-comparator.component'
import { QuantityComparisionSelectComponent } from './quantity-comparision-select/quantity-comparision-select.component'
import { QuantityRangeComponent } from './quantity-range/quantity-range.component'

@Component({
  selector: 'num-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [QuantityComparisionSelectComponent, QuantityRangeComponent, QuantityComparatorComponent, AllowedUnitsComponent],
})
export class QuantityComponent {
  private readonly quantityFilterFactoryService = inject(QuantityFilterFactoryService)

  public readonly quantityFilter = model<AbstractQuantityFilter>()
  public readonly display = input<Display>()

  public readonly selectedQuantityFilterComparator = signal<QuantityComparisonOption | undefined>(undefined)
  public readonly selectedQuantityFilterUnit = signal<QuantityUnit | undefined>(undefined)

  public readonly isQuantityNotSet = computed(() => this.selectedQuantityFilterComparator() === QuantityComparisonOption.NONE)
  public readonly isBetweenFilter = computed(() => this.selectedQuantityFilterComparator() === QuantityComparisonOption.BETWEEN)
  public readonly isComparatorFilter = computed(
    () =>
      this.selectedQuantityFilterComparator() !== QuantityComparisonOption.BETWEEN &&
      this.selectedQuantityFilterComparator() !== QuantityComparisonOption.NONE &&
      this.selectedQuantityFilterComparator() !== undefined
  )

  public readonly quantityComparatorFilter = computed<QuantityComparatorFilter | undefined>(() => {
    const f = this.quantityFilter()
    return f?.getType() === FilterTypes.QUANTITY_COMPARATOR ? (f as QuantityComparatorFilter) : undefined
  })

  public readonly quantityRangeFilter = computed<QuantityRangeFilter | undefined>(() => {
    const f = this.quantityFilter()
    return f?.getType() === FilterTypes.QUANTITY_RANGE ? (f as QuantityRangeFilter) : undefined
  })

  constructor() {
    effect(() => {
      const filter = this.quantityFilter()
      if (!filter) {
        return
      }
      this.quantityFilterFactoryService.setAllowedUnits(filter.getAllowedUnits())
      this.quantityFilterFactoryService.setPrecision(filter.getPrecision())
      this.selectedQuantityFilterComparator.set(filter.getComparator())
      const unit = filter.getSelectedUnit() ?? filter.getAllowedUnits()[0]
      this.selectedQuantityFilterUnit.set(unit)
      this.quantityFilterFactoryService.setQuantityUnit(unit)
    })
  }

  public setSelectedQuantityFilterOption(option: QuantityComparisonOption): void {
    this.selectedQuantityFilterComparator.set(option)
    if (option === QuantityComparisonOption.NONE) {
      this.quantityFilter.set(this.quantityFilterFactoryService.createEmptyQuantityFilter())
    }
  }

  public setSelectQuantityFilterUnit(selectedUnit: QuantityUnit) {
    this.selectedQuantityFilterUnit.set(selectedUnit)
    this.quantityFilterFactoryService.setQuantityUnit(selectedUnit)
  }
}
