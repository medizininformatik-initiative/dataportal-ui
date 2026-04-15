import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { CriterionFilterChipService } from 'src/app/shared/service/FilterChips/Criterion/CriterionFilterChips.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipData } from '../../../../../../shared/models/FilterChips/FilterChipData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';

@Component({
  selector: 'num-criterion-header',
  templateUrl: './criterion-header.component.html',
  styleUrls: ['./criterion-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriterionHeaderComponent implements OnChanges, OnInit {
  @Input()
  criterion!: Criterion;

  quantityFilterChips: FilterChipData[] = [];

  timeRestrictionFilterChips: FilterChipData[] = [];

  termCodesFilterChips: FilterChipData[] = [];

  conceptFilterChips: FilterChipData[] = [];

  refernceFilterChips: FilterChipData[] = [];

  system: Display;

  constructor(private filterChipsService: CriterionFilterChipService) {}

  ngOnInit(): void {
    this.iniializeChips();
    this.system = TerminologySystemDictionary.getNameByUrl(
      this.criterion.getTermCodes()[0].getSystem()
    );
  }

  ngOnChanges() {
    this.iniializeChips();
  }

  private iniializeChips() {
    this.getQuantityFilterChips();
    this.getTimeRestrictionFilterChips();
    this.getTermCodesFilterChips();
    this.getConceptFilterChips();
    this.getReferenceFilterChips();
  }

  public getReferenceFilterChips() {
    this.refernceFilterChips = this.filterChipsService.createReferenceChips(this.criterion);
  }

  private getQuantityFilterChips() {
    this.quantityFilterChips = this.filterChipsService.generateQuantityChips(this.criterion);
  }

  private getTimeRestrictionFilterChips() {
    this.timeRestrictionFilterChips = this.filterChipsService.buildTimeRestrictionChips(
      this.criterion
    );
  }

  private getTermCodesFilterChips() {
    this.termCodesFilterChips = this.filterChipsService.generateTermcodeChips(this.criterion);
  }

  private getConceptFilterChips() {
    this.conceptFilterChips = this.filterChipsService.generateConceptChips(this.criterion);
  }
}
