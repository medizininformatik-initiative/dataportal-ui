import { Component, OnInit, inject, input, model, output } from '@angular/core'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { CriteriaBulkEntry } from '../../../../../../model/Search/ListEntries/CriteriaBulkEntry'
import { HashService } from '../../../../../../service/Hash.service'
import { SelectedBulkCriteriaProvider } from '../../../../../../service/SelectedBulkCriteria.service'
import { InformationSectionComponent } from '../../../../../../shared/components/information-section/information-section.component'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-edit-termcode',
  templateUrl: './termcode.component.html',
  styleUrls: ['./termcode.component.scss'],
  standalone: true,
  imports: [MatTabGroup, MatTab, MatTabLabel, FontAwesomeModule, InformationSectionComponent, TranslateModule, DisplayTranslationPipe],
})
export class TermcodeComponent implements OnInit {
  private readonly hashService = inject(HashService)
  private readonly selectedBulkCriteriaService = inject(SelectedBulkCriteriaProvider)

  public readonly termCodes = model<TerminologyCode[]>()
  public readonly context = input<TerminologyCode>(undefined)

  public readonly changedTermCodes = output<TerminologyCode[]>()

  public bulkEntries: CriteriaBulkEntry[] = []

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}
  public ngOnInit(): void {
    this.createBulkEntries()
  }

  private createBulkEntries(): void {
    this.bulkEntries = this.termCodes().map((termCode: TerminologyCode) => {
      const hash = this.hashService.createCriterionHash(this.context(), termCode)
      return this.selectedBulkCriteriaService.getFoundById(hash)
    })
  }

  public removeTermCode(termCodeToRemove: TerminologyCode): void {
    this.termCodes.update((codes: TerminologyCode[]) =>
      codes.filter(
        (termCode: TerminologyCode) =>
          !(termCode.getCode() === termCodeToRemove.getCode() && termCode.getSystem() === termCodeToRemove.getSystem())
      )
    )
    this.createBulkEntries()
    this.changedTermCodes.emit(this.termCodes())
  }

  public onTermCodesChange(updatedTermCodes: TerminologyCode[]): void {
    this.changedTermCodes.emit(updatedTermCodes)
  }
}
