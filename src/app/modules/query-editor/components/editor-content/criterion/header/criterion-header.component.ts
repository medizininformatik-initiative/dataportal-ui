import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { InterfaceFilterChip } from 'src/app/shared/models/FilterChips/InterfaceFilterChip';
import { CriterionFilterChipService } from 'src/app/shared/service/FilterChips/Criterion/CriterionFilterChips.service';

@Component({
  selector: 'num-criterion-header',
  templateUrl: './criterion-header.component.html',
  styleUrls: ['./criterion-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriterionHeaderComponent implements OnChanges, OnInit {
  @Input()
  criterion: Criterion;

  quantityFilterChips: InterfaceFilterChip[] = [];

  timeRestrictionFilterChips: InterfaceFilterChip[] = [];

  termCodesFilterChips: InterfaceFilterChip[] = [];

  conceptFilterChips: InterfaceFilterChip[] = [];

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
  }

  private getQuantityFilterChips() {
    this.quantityFilterChips = this.filterChipsService.buildQuantityChips(this.criterion);
  }

  private getTimeRestrictionFilterChips() {
    this.timeRestrictionFilterChips = this.filterChipsService.buildTimeRestrictionChips(
      this.criterion
    );
  }

  private getTermCodesFilterChips() {
    this.termCodesFilterChips = this.filterChipsService.buildTermCodeChips(this.criterion);
  }

  private getConceptFilterChips() {
    this.conceptFilterChips = this.filterChipsService.buildConceptChips(this.criterion);
  }
}
