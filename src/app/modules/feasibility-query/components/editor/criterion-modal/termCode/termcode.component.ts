import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { HashService } from '../../../../../../service/Hash.service';
import { SelectedBulkCriteriaService } from '../../../../../../service/SelectedBulkCriteria.service';
import { CriteriaBulkEntry } from '../../../../../../model/Search/ListEntries/CriteriaBulkEntry';

@Component({
  selector: 'num-edit-termcode',
  templateUrl: './termcode.component.html',
  styleUrls: ['./termcode.component.scss'],
})
export class TermcodeComponent implements OnInit {
  @Input()
  termCodes: TerminologyCode[];
  @Input()
  context: TerminologyCode;

  @Output()
  changedTermCodes = new EventEmitter<TerminologyCode[]>();

  bulkEntries: CriteriaBulkEntry[] = [];
  constructor(
    private hashService: HashService,
    private selectedBulkCriteriaService: SelectedBulkCriteriaService
  ) {}
  ngOnInit(): void {
    this.bulkEntries = this.termCodes.map((termCode) => {
      const hash = this.hashService.createCriterionHash(this.context, termCode);
      return this.selectedBulkCriteriaService.getFoundEntry(hash);
    });
  }

  public removeTermCode(termCodeToRemove: TerminologyCode): void {
    this.termCodes = this.termCodes.filter(
      (termCode: TerminologyCode) =>
        termCode.getCode() !== termCodeToRemove.getCode() ||
        termCode.getSystem() !== termCodeToRemove.getSystem()
    );
    this.changedTermCodes.emit(this.termCodes);
  }

  public onTermCodesChange(updatedTermCodes: TerminologyCode[]): void {
    this.changedTermCodes.emit(updatedTermCodes);
  }
}
