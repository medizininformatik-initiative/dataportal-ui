import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { Component, computed, effect, inject, input } from '@angular/core'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { FieldsColComponent } from './colums/fields-col/fields-col.component'
import { FiltersColComponent } from './colums/filters-col/filters-col.component'
import { LabelColComponent } from './colums/label-col/label-col.component'
import { LinkedReferencesComponent } from './linked-references/linked-references.component'
import { MenuComponent } from 'src/app/shared/components/menu/menu.component'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ReferenceColComponent } from './colums/reference-col/reference-col.component'
import { RemoveReferenceService } from 'src/app/service/RemoveReference.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProviderService } from '../../../../../../service/Provider/DataSelectionProvider.service'
import { DataSelectionMenuService } from '../../../../../../shared/service/Menu/DataSelection/DataSelectionMenu.service'

@Component({
  selector: 'num-data-selection-boxes',
  templateUrl: './data-selection-boxes.component.html',
  styleUrls: ['./data-selection-boxes.component.scss'],
  providers: [DataSelectionFieldsChipsService],
  standalone: true,
  imports: [
    DisplayTranslationPipe,
    FieldsColComponent,
    FiltersColComponent,
    LabelColComponent,
    LinkedReferencesComponent,
    MenuComponent,
    ReferenceColComponent,
    TranslateModule,
  ],
})
export class DataSelectionBoxesComponent {
  private readonly removeReferenceService = inject(RemoveReferenceService)
  private readonly menuService = inject(DataSelectionMenuService)
  private readonly appSettingsProvider = inject(AppSettingsProviderService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly navigationHelper = inject(NavigationHelperService)

  readonly profile = input.required<DataSelectionProfile>()
  readonly isEditable = input<boolean>(true)
  readonly searchTerm = input<string | undefined>(undefined)

  readonly isReferenced = computed(() => {
    const dataSelection = this.activeDataSelection()
    if (!dataSelection) {
      return false
    }
    return dataSelection.getProfiles().some((profile: DataSelectionProfile) =>
      profile
        .getProfileFields()
        .getSelectedReferenceFields()
        .some((ref) => ref.getLinkedProfileIds().includes(profile.getId()))
    )
  })

  readonly menuItems = computed<MenuItemInterface[]>(() => {
    const isMainProfile =
      this.appSettingsProvider.getDsePatientProfileUrl() === this.profile()?.getUrl()
    return this.menuService.getMenuItems(isMainProfile)
  })

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProvider.getActiveDataSelection(),
    { initialValue: undefined }
  )

  public deleteProfile(id: string): void {
    this.removeReferenceService.delete(id)
  }

  public navigate(): void {
    const id = this.profile()?.getId()
    if (id) {
      this.navigationHelper.navigateToEditProfile(id)
    }
  }

  public onReferenceSetChange(isReferenceSet: boolean): void {
    this.profile().getReference().setIsReferenceSet(isReferenceSet)
    const clonedProfile = DataSelectionProfileCloner.deepCopyProfile(this.profile())
    this.dataSelectionProvider.setActiveProfile(clonedProfile)
  }
}
