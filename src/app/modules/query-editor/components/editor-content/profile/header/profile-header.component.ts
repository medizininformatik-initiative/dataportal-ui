import { AsyncPipe } from '@angular/common'
import { Component, computed, inject, input, OnInit, output } from '@angular/core'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionFiltersFilterChips } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFiltersFilterChips.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { FilterChipProfileRefrenceAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipProfileRefrenceAdapter'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { Observable, of } from 'rxjs'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileReferenceGroup } from 'src/app/shared/models/FilterChips/ProfileReferenceChipData'
import { SearchbarComponent } from '../../../../../../shared/components/search/searchbar.component'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  providers: [DataSelectionFieldsChipsService, DataSelectionFiltersFilterChips],
  standalone: true,
  imports: [SearchbarComponent, FilterChipsComponent, AsyncPipe, TranslateModule],
})
export class ProfileHeaderComponent implements OnInit {
  private profileProviderService = inject(ProfileProviderService)
  private fieldsFilterChipsService = inject(DataSelectionFieldsChipsService)
  private filtersFilterChipsService = inject(DataSelectionFiltersFilterChips)
  private translation = inject(DisplayTranslationPipe)

  readonly profile = input<DataSelectionProfile>(undefined)

  readonly updatedLabel = output<string>()

  filterChipsSelected = false
  displayExpanded = false
  labelNumber: string = ''
  label: string = ''
  placeholder: string = ''

  readonly $fieldsFilterChips = computed<Observable<FilterChipData[]>>(() => {
    const fields = this.profile()?.getProfileFields()?.getSelectedBasicFields() ?? []
    return this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(fields)
  })

  readonly filtersFilterChips$ = computed<Observable<FilterChipData[]>>(() => {
    const filters = this.profile()?.getFilters() ?? []
    if (filters.length > 0) {
      return of(this.filtersFilterChipsService.generateFilterChipsForDataSelectionFilters(filters))
    }
    return of([])
  })

  readonly profileReferenceChips = computed<FilterChipData[]>(() => {
    const selectedReferenceFields =
      this.profile()?.getProfileFields()?.getSelectedReferenceFields() ?? []
    return this.getProfileReferenceChips(selectedReferenceFields)
  })

  ngOnInit(): void {
    this.labelNumber =
      this.profile()?.getLabelNumber() > 0 ? ' (' + this.profile()?.getLabelNumber() + ')' : ''
    this.label = this.translation.transform(this.profile()?.getLabel()) + this.labelNumber
    this.placeholder = this.translation.transform(this.profile()?.getDisplay()) + this.labelNumber
  }

  /**
   * The search bar emits its start value once after its debounce. An unchanged label must not reach
   * the staged profile: saving it replaces the profile and resets what is open in the editor tabs.
   * @param label - The label text from the search bar
   */
  public setLabel(label: string) {
    if (label === this.label) {
      return
    }
    this.label = label
    this.updatedLabel.emit(label)
  }

  private getProfileReferenceChips(
    selectedReferenceFields: SelectedReferenceField[]
  ): FilterChipData[] {
    const groupedByElementId = selectedReferenceFields.reduce((acc, ref) => {
      const key = ref.getElementId()
      if (!acc[key]) {
        acc[key] = []
      }
      const linkedProfiles = ref
        .getLinkedProfileIds()
        .map((id) => this.profileProviderService.getOne(id))
        .filter((profile) => !!profile?.getDisplay())
        .map((profile) => ({ display: profile.getDisplay(), number: profile.getLabelNumber() }))

      acc[key].push(...linkedProfiles)
      return acc
    }, {} as ProfileReferenceGroup)

    const groups: ProfileReferenceGroup[] = Object.entries(groupedByElementId).map(
      ([elementId, profiles]) => ({ elementId, profiles })
    )
    return groups.map((group) =>
      FilterChipProfileRefrenceAdapter.adaptToProfileReferenceChipData(group)
    )
  }
}
