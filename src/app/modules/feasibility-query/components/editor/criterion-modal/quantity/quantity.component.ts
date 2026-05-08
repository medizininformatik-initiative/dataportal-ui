import { AbstractQuantityFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/AbstractQuantityFilter';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter';
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions';
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter';
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit';
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';

@Component({
  selector: 'num-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityComponent implements OnInit {
  FilterTypes: typeof FilterTypes = FilterTypes;

  @Input()
  quantityFilter!: AbstractQuantityFilter;

  @Output()
  quantityFilterChange = new EventEmitter<AbstractQuantityFilter>();

  @Input()
  display!: Display;

  /**
   * UI conditions
   */
  isQuantityNotSet = false;
  isBetweenFilter = false;
  isComparatorFilter = false;

  /**
   * QuantityFilter Instances
   */
  quantityComparatorFilter: QuantityComparatorFilter | undefined = undefined;
  quantityRangeFilter: QuantityRangeFilter | undefined = undefined;

  selectedQuantityFilterComparator!: QuantityComparisonOption;

  selectedQuantityFilterUnit: QuantityUnit | undefined = undefined;

  QuantityComparisonOption: typeof QuantityComparisonOption = QuantityComparisonOption;

  constructor(private quantityFilterFactoryService: QuantityFilterFactoryService) {}

  ngOnInit() {
    this.setupFactoryService();
    this.initializaFilterType();
    this.initializeUnit();
    this.selectedQuantityFilterComparator = this.quantityFilter.getComparator();
  }

  private setupFactoryService() {
    this.quantityFilterFactoryService.setAllowedUnits(this.quantityFilter.getAllowedUnits());
    this.quantityFilterFactoryService.setPrecision(this.quantityFilter.getPrecision());
  }

  private initializaFilterType() {
    const type: FilterTypes = this.quantityFilter.getType();
    if (type === FilterTypes.QUANTITY_COMPARATOR) {
      this.quantityComparatorFilter = this.quantityFilter as QuantityComparatorFilter;
      this.isComparatorFilter = true;
    }
    if (type === FilterTypes.QUANTITY_RANGE) {
      this.quantityRangeFilter = this.quantityFilter as QuantityRangeFilter;
      this.isBetweenFilter = true;
    }
    if (type === FilterTypes.QUANTITY_NOT_SET) {
      this.isQuantityNotSet = true;
    }
  }

  private initializeUnit() {
    if (this.quantityFilter.getSelectedUnit()) {
      this.setSelectQuantityFilterUnit(this.quantityFilter.getSelectedUnit());
    } else {
      this.setSelectQuantityFilterUnit(this.quantityFilter.getAllowedUnits()[0]);
    }
  }

  public setSelectedQuantityFilterOption(option: QuantityComparisonOption): void {
    this.selectedQuantityFilterComparator =
      QuantityComparisonOption[option as keyof typeof QuantityComparisonOption];
    if (option === QuantityComparisonOption.NONE) {
      const emptyQuantityFilter = this.quantityFilterFactoryService.createEmptyQuantityFilter();
      this.updateConditions();
      this.quantityFilterChange.emit(emptyQuantityFilter);
    }
    this.updateConditions();
  }

  private updateConditions() {
    this.isBetweenFilter =
      this.selectedQuantityFilterComparator === QuantityComparisonOption.BETWEEN;
    this.isComparatorFilter =
      this.selectedQuantityFilterComparator !== QuantityComparisonOption.BETWEEN &&
      this.selectedQuantityFilterComparator !== QuantityComparisonOption.NONE;
    this.isQuantityNotSet = this.selectedQuantityFilterComparator === QuantityComparisonOption.NONE;
  }

  public setSelectQuantityFilterUnit(selectedUnit: QuantityUnit) {
    this.selectedQuantityFilterUnit = selectedUnit;
    this.quantityFilterFactoryService.setQuantityUnit(selectedUnit);
  }

  public emitQuantityFilterInstance(quantityFilter: AbstractQuantityFilter) {
    this.quantityFilterChange.emit(quantityFilter);
  }
}
