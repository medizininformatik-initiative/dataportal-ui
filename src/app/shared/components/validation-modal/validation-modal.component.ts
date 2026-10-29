import { Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatDialogRef } from '@angular/material/dialog'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { DataDefinitionValidationService } from 'src/app/service/Validation/Internal/DataDefinitionValidation.service'
import { ProfileValidationState } from 'src/app/service/Validation/Internal/DataSelectionValidation.service'
import { ProfileValidationService } from 'src/app/service/Validation/Internal/ProfileValidationService.service'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { v4 as uuidv4 } from 'uuid'
import { TableRowData } from '../../models/TableData/TableRowData'
import { ButtonComponent } from '../button/button.component'
import { HeaderComponent } from '../header/header.component'
import { HeaderDescriptionComponent } from '../header-description/header-description.component'
import { InformationSectionComponent } from '../information-section/information-section.component'
import { ModalWindowComponent } from '../modal-window/modal-window.component'
import { TableComponent } from '../table/table.component'
import { CriterionValidationEntry } from './table/CriterionValidationEntry'
import { CriterionValidationTableAdapter } from './table/CriterionValidationTableAdapter'
import { ProfileValidationEntry } from './table/ProfileValidationContextEntry'
import { ProfileValidationTableAdapter } from './table/ProfileValidationTableAdapter'
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
    InformationSectionComponent,
    TranslateModule,
    HeaderDescriptionComponent,
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

  public readonly activeTab = signal<'feasibility' | 'dataSelection'>('feasibility')

  private readonly dataDefinitionValidationStatus = computed(() => this.dataDefinitionValidationService.getDataDefinitionValidationStatus())

  // ─── Summary ─────────────────────────────────────────────────────────────────

  public readonly fqIsValid = computed(() => this.dataDefinitionValidationStatus().feasibilityQueryValidationState.isValid)
  public readonly dsIsValid = computed(() => this.dataDefinitionValidationStatus().dataSelectionValidationState.isValid)
  public readonly fqHasInclusionCriteria = computed(
    () => this.dataDefinitionValidationStatus().feasibilityQueryValidationState.hasInclusionCriteria
  )

  public readonly fqValidCount = computed(
    () => this.dataDefinitionValidationStatus().feasibilityQueryValidationState.criterionValidationStates.filter((s) => s.isValid).length
  )
  public readonly fqTotalCount = computed(() => this.dataDefinitionValidationStatus().feasibilityQueryValidationState.criterionCount)

  public readonly dsValidCount = computed(
    () =>
      this.dataDefinitionValidationStatus().dataSelectionValidationState.profileValidationStates.filter(
        (validatedProfile) => validatedProfile.isValid
      ).length
  )
  public readonly dsTotalCount = computed(() => this.dataDefinitionValidationStatus().dataSelectionValidationState.profileCount)

  // ─── Table data ───────────────────────────────────────────────────────────────

  public readonly fqTableData = computed<TableData>(() => {
    const invalidIds = this.dataDefinitionValidationStatus()
      .feasibilityQueryValidationState.criterionValidationStates.filter((context) => !context.isValid)
      .map((context) => context.criterionId)
    const entries = invalidIds.map((criterionId: string) => {
      const criterion = this.criterionProvider.getOne(criterionId)
      return new CriterionValidationEntry(uuidv4(), criterion.getDisplay(), false, criterion.getId())
    })
    return this.feasibilityValidationTableAdapter.adapt(entries)
  })

  public readonly dsTableData = computed<TableData>(() => {
    const validatedProfiles = this.dataDefinitionValidationStatus().dataSelectionValidationState.profileValidationStates
    const entries = validatedProfiles.map((profileState) => this.buildProfileValidationEntry(profileState))
    return this.profileValidationTableAdapter.adapt(entries)
  })

  private buildProfileValidationEntry(profileState: ProfileValidationState): ProfileValidationEntry {
    const profile = this.profileProvider.getOne(profileState.profileId)
    const referenceFieldIds = profileState.referenceFieldId
    return new ProfileValidationEntry(
      uuidv4(),
      profile.getDisplay(),
      profileState.state,
      profileState.isValid,
      profile.getId(),
      referenceFieldIds
    )
  }
  // ─── Actions ──────────────────────────────────────────────────────────────────

  public close(): void {
    this.dialogRef.close()
  }

  public onProfileIconClicked(entry: TableRowData): void {
    const originalEntry = entry.originalEntry
    if (originalEntry instanceof ProfileValidationEntry) {
      const referenceFieldId = originalEntry.getReferenceFieldId()
      if (referenceFieldId) {
        this.navigationHelper.navigateToEditProfile(originalEntry.getProfileId(), {
          activeTab: referenceFieldId,
        })
      } else {
        this.navigationHelper.navigateToEditProfile(originalEntry.getProfileId())
      }
      this.dialogRef.close()
    }
  }

  public onCriterionIconClicked(entry: TableRowData): void {
    const originalEntry = entry.originalEntry
    if (originalEntry instanceof CriterionValidationEntry) {
      this.navigationHelper.navigateToEditCriterion(originalEntry.getCriterionId())
      this.dialogRef.close()
    }
  }
}
