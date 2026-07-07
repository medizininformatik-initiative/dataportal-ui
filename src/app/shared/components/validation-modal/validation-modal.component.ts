import { ButtonComponent } from '../button/button.component'
import { Component, computed, inject, signal } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { CriterionValidationEntry } from './table/CriterionValidationEntry'
import { CriterionValidationTableAdapter } from './table/CriterionValidationTableAdapter'
import { DataDefinitionValidationService } from 'src/app/service/Validation/DataDefinitionValidation.service'
import { ProfileValidationState } from 'src/app/service/Validation/DataSelectionValidation.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {
  HeaderComponent,
  HeaderDescriptionComponent,
  ModalWindowComponent,
  SectionNameComponent,
} from '../shared-components.module'
import { MatDialogRef } from '@angular/material/dialog'
import { MatTabsModule } from '@angular/material/tabs'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileValidationEntry } from './table/ProfileValidationContextEntry'
import { ProfileValidationTableAdapter } from './table/ProfileValidationTableAdapter'
import { TableComponent } from '../table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { v4 as uuidv4 } from 'uuid'
@Component({
  selector: 'num-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    ModalWindowComponent,
    TableComponent,
    FontAwesomeModule,
    ButtonComponent,
    TranslateModule,
    MatTabsModule,
    HeaderDescriptionComponent,
    SectionNameComponent,
  ],
})
export class ValidationModalComponent {
  // ─── Services ───────────────────────────────────────────────────────────────

  private readonly dataDefinitionValidationService = inject(DataDefinitionValidationService)
  private readonly criterionProvider = inject(CriterionProviderService)
  private readonly profileProvider = inject(ProfileProviderService)
  private readonly dialogRef = inject(MatDialogRef<ValidationModalComponent>)
  private readonly navigationHelper = inject(NavigationHelperService)

  private readonly feasibilityValidationTableAdapter = new CriterionValidationTableAdapter()
  private readonly profileValidationTableAdapter = new ProfileValidationTableAdapter()

  readonly activeTab = signal<'feasibility' | 'dataSelection'>('feasibility')

  private readonly dataDefinitionValidationStatus = computed(() =>
    this.dataDefinitionValidationService.getDataDefinitionValidationStatus()
  )

  // ─── Summary ─────────────────────────────────────────────────────────────────

  readonly fqIsValid = computed(
    () => this.dataDefinitionValidationStatus().feasibilityQueryValidationState.isValid
  )
  readonly dsIsValid = computed(
    () => this.dataDefinitionValidationStatus().dataSelectionValidationState.isValid
  )

  readonly fqValidCount = computed(() => {
    return this.dataDefinitionValidationStatus().feasibilityQueryValidationState.count
  })

  readonly dsValidCount = computed(
    () =>
      this.dataDefinitionValidationStatus().dataSelectionValidationState.validatedProfiles.filter(
        (validatedProfile) => validatedProfile.isValid
      ).length
  )
  readonly dsTotalCount = computed(
    () => this.dataDefinitionValidationStatus().dataSelectionValidationState.count
  )

  // ─── Table data ───────────────────────────────────────────────────────────────

  readonly fqTableData = computed<TableData>(() => {
    const invalidIds = this.dataDefinitionValidationStatus()
      .feasibilityQueryValidationState.validatedCriterions.filter((context) => !context.isValid)
      .map((context) => context.criterionId)
    const entries = invalidIds.map((criterionId: string) => {
      const criterion = this.criterionProvider.getOne(criterionId)
      return new CriterionValidationEntry(
        uuidv4(),
        criterion.getDisplay(),
        false,
        criterion.getId()
      )
    })
    return this.feasibilityValidationTableAdapter.adapt(entries)
  })

  readonly dsTableData = computed<TableData>(() => {
    const entries: ProfileValidationEntry[] = []

    for (const profile of this.dataDefinitionValidationStatus().dataSelectionValidationState
      .validatedProfiles) {
      entries.push(this.createEntry(profile))
    }

    return this.profileValidationTableAdapter.adapt(entries)
  })

  private createEntry(validation: ProfileValidationState): ProfileValidationEntry {
    const profile = this.profileProvider.getOne(validation.profileId)

    return new ProfileValidationEntry(
      uuidv4(),
      profile.getDisplay(),
      validation.state,
      validation.isValid,
      profile.getId()
    )
  }
  // ─── Actions ──────────────────────────────────────────────────────────────────

  close(): void {
    this.dialogRef.close()
  }

  goToIssues(): void {
    if (this.activeTab() === 'feasibility') {
      this.navigationHelper.navigateToFeasibilityQueryEditor()
    } else {
      this.navigationHelper.navigateToDataQueryDataSelection()
    }
    this.dialogRef.close()
  }
}
