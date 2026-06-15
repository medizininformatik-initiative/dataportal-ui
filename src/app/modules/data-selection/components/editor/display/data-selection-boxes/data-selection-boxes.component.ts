import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component'
import { Component, computed, effect, inject, input } from '@angular/core'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionFiltersFilterChips } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFiltersFilterChips.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { InfoTooltipDirective } from '../../../../../../shared/directives/info-tooltip.directive'
import { LinkedBadgeComponent } from '../../../../../../shared/components/linked-badge/linked-badge.component'
import { map } from 'rxjs'
import { MenuComponent } from '../../../../../../shared/components/menu/menu.component'
import { MenuItemInterface } from '../../../../../../shared/models/Menu/MenuItemInterface'
import { MenuServiceDataSelection } from '../../../../../../shared/service/Menu/DataSelection/MenuServiceDataSelection.service'
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference'
import { ProfileReferenceTileComponent } from '../../../../../../shared/components/profile-reference-tile/profile-reference-tile.component'
import { RemoveReferenceService } from 'src/app/service/RemoveReference.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-data-selection-boxes',
  templateUrl: './data-selection-boxes.component.html',
  styleUrls: ['./data-selection-boxes.component.scss'],
  providers: [DataSelectionFieldsChipsService],
  standalone: true,
  imports: [
    InfoTooltipDirective,
    FilterChipsComponent,
    CheckboxComponent,
    MenuComponent,
    LinkedBadgeComponent,
    ProfileReferenceTileComponent,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})
export class DataSelectionBoxesComponent {
  private fieldsFilterChipsService = inject(DataSelectionFieldsChipsService)
  private filtersFilterChipsService = inject(DataSelectionFiltersFilterChips)
  private removeReferenceService = inject(RemoveReferenceService)
  private menuService = inject(MenuServiceDataSelection)
  private appSettingsProvider = inject(AppSettingsProviderService)
  private dataSelectionProviderService = inject(DataSelectionProviderService)

  readonly profile = input<DataSelectionProfile>()
  readonly isEditable = input<boolean>()

  displayExpanded = false

  readonly display = computed(() => this.profile()?.getDisplay().getOriginal())
  readonly label = computed(() => this.profile()?.getLabel())

  readonly fieldsFilterChips = toSignal(this.fieldsFilterChipsService.filterChips$, {
    initialValue: [] as FilterChipData[],
  })

  readonly filtersFilterChips = computed<FilterChipData[]>(() => {
    const filters = this.profile()?.getFilters() ?? []
    return filters.length > 0
      ? this.filtersFilterChipsService.generateFilterChipsForDataSelectionFilters(filters)
      : []
  })

  readonly unlinkedRequiredOrRecommendedReferences = computed(
    () => this.profile().getProfileFields().getUnlinkedRequiredOrRecommendedReferences() ?? []
  )

  readonly selectedReferenceFields = computed(
    () => this.profile().getProfileFields().getSelectedReferenceFields() ?? []
  )

  readonly menuItems = computed<MenuItemInterface[]>(() => {
    const isMainProfile =
      this.appSettingsProvider.getDsePatientProfileUrl() === this.profile()?.getUrl()
    return this.menuService.getMenuItemsForDataSelection(isMainProfile)
  })

  private readonly activeDataSelection$ = this.dataSelectionProviderService.getActiveDataSelection()

  readonly isReferenced = toSignal(
    this.activeDataSelection$.pipe(
      map((dataSelection) =>
        dataSelection.getProfiles().some((profile) =>
          profile
            .getProfileFields()
            .getSelectedReferenceFields()
            .some((referenceField) =>
              referenceField
                .getLinkedProfileIds()
                .some((linkedProfileId) => this.profile()?.getId() === linkedProfileId)
            )
        )
      )
    ),
    { initialValue: false }
  )

  constructor() {
    effect(() => {
      const fields = this.profile()?.getProfileFields()?.getSelectedBasicFields() ?? []
      this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(fields)
    })
  }

  public toggleIsReferenceSet(reference: ProfileReference): void {
    reference.setIsReferenceSet(!reference.getIsReferenceSet())
  }

  public deleteProfile(id: string): void {
    this.removeReferenceService.delete(id)
  }
}
