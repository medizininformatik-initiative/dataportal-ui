import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { HashService } from '../../../../../../service/Hash.service'
import { SelectedBulkCriteriaProvider } from '../../../../../../service/SelectedBulkCriteria.service'
import { CriteriaBulkEntry } from '../../../../../../model/Search/ListEntries/CriteriaBulkEntry'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InformationSectionComponent } from '../../../../../../shared/components/information-section/information-section.component'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-edit-termcode',
  templateUrl: './termcode.component.html',
  styleUrls: ['./termcode.component.scss'],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FontAwesomeModule,
    InformationSectionComponent,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})
export class TermcodeComponent implements OnInit {
  private hashService = inject(HashService)
  private selectedBulkCriteriaService = inject(SelectedBulkCriteriaProvider)

  @Input()
  termCodes: TerminologyCode[]
  @Input()
  context: TerminologyCode

  @Output()
  changedTermCodes = new EventEmitter<TerminologyCode[]>()

  bulkEntries: CriteriaBulkEntry[] = []

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}
  ngOnInit(): void {
    this.createBulkEntries()
  }

  private createBulkEntries(): void {
    this.bulkEntries = this.termCodes.map((termCode) => {
      const hash = this.hashService.createCriterionHash(this.context, termCode)
      return this.selectedBulkCriteriaService.getFoundById(hash)
    })
  }

  public removeTermCode(termCodeToRemove: TerminologyCode): void {
    this.termCodes = this.termCodes.filter(
      (termCode: TerminologyCode) =>
        !(
          termCode.getCode() === termCodeToRemove.getCode() &&
          termCode.getSystem() === termCodeToRemove.getSystem()
        )
    )
    this.createBulkEntries()
    this.changedTermCodes.emit(this.termCodes)
  }

  public onTermCodesChange(updatedTermCodes: TerminologyCode[]): void {
    this.changedTermCodes.emit(updatedTermCodes)
  }
}
