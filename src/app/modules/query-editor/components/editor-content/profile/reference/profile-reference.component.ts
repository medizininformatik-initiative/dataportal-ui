import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, input, output } from '@angular/core'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { SelectedReferenceFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/SelectedReferenceFieldsCloner'
import { InformationSectionComponent } from '../../../../../../shared/components/information-section/information-section.component'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { ReferenceFieldTabComponent } from './reference-field-tab/reference-field-tab.component'

@Component({
  selector: 'num-profile-reference',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-reference.component.html',
  styleUrls: ['./profile-reference.component.scss'],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FontAwesomeModule,
    InformationSectionComponent,
    ReferenceFieldTabComponent,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})
export class ProfileReferenceComponent implements OnInit, OnDestroy {
  public readonly referenceFields = input<ReferenceField[]>(undefined)
  public readonly profileId = input<string>(undefined)
  public readonly selectedReferenceFields = input<SelectedReferenceField[]>([])
  public readonly updatedSelectedReferenceFields = output<SelectedReferenceField[]>()
  public readonly activeFieldTabId = input<string>(undefined)

  public readonly selectedIndex = computed(() => {
    if (this.activeFieldTabId() === undefined) {
      return 1
    } else {
      const index = this.referenceFields().findIndex((ref: ReferenceField) => ref.getElementId() === this.activeFieldTabId())
      return index >= 0 ? index + 1 : 1
    }
  })
  constructor() {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public setSelectedReference(selectedReferenceField: SelectedReferenceField, referencedField: ReferenceField): void {
    const linkedProfileIds = selectedReferenceField.getLinkedProfileIds()
    const len = linkedProfileIds.length
    const index = this.findSelectedField(referencedField)
    if (len > 0) {
      if (index !== -1) {
        this.selectedReferenceFields()[index] = selectedReferenceField
      } else {
        this.selectedReferenceFields().push(selectedReferenceField)
      }
    } else if (index !== -1) {
      this.selectedReferenceFields().splice(index, 1)
    }

    this.emitUpdatedFields()
  }

  private findSelectedField(referencedField: ReferenceField): number | undefined {
    return this.selectedReferenceFields().findIndex(
      (field: SelectedReferenceField) => field.getElementId() === referencedField.getElementId()
    )
  }

  private emitUpdatedFields(): void {
    const clonedFields = SelectedReferenceFieldsCloner.deepCopySelectedReferenceFields(this.selectedReferenceFields())
    this.updatedSelectedReferenceFields.emit(clonedFields)
  }
}
