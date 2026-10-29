import { AsyncPipe } from '@angular/common'
import { Component, computed, inject, input, OnInit, output } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { FilterChipProfileRefrenceAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipProfileRefrenceAdapter'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { ProfileReferenceGroup } from 'src/app/shared/models/FilterChips/ProfileReferenceChipData'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionFiltersFilterChips } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFiltersFilterChips.service'
import { FilterChipsComponent } from '../../../../../../shared/components/filter-chips/filter-chips.component'
import { SearchbarComponent } from '../../../../../../shared/components/search/searchbar.component'
import { NumPillExpandableDirective } from '../../../../../../shared/directives/num-pill-expandable.directive'
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  providers: [DataSelectionFieldsChipsService, DataSelectionFiltersFilterChips],
  standalone: true,
  imports: [SearchbarComponent, NumPillExpandableDirective, FilterChipsComponent, AsyncPipe, TranslateModule],
})
export class ProfileHeaderComponent implements OnInit {
  private readonly profileProviderService = inject(ProfileProviderService)
  private readonly fieldsFilterChipsService = inject(DataSelectionFieldsChipsService)
  private readonly filtersFilterChipsService = inject(DataSelectionFiltersFilterChips)
  private readonly translation = inject(DisplayTranslationPipe)

  public readonly profile = input<DataSelectionProfile>(undefined)

  public readonly updatedLabel = output<string>()

  public filterChipsSelected = false
  public displayExpanded = false
  public labelNumber: string = ''
  public label: string = ''
  public placeholder: string = ''

  public readonly $fieldsFilterChips = computed<Observable<FilterChipData[]>>(() => {
    const fields = this.profile()?.getProfileFields()?.getSelectedBasicFields() ?? []
    return this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(fields)
  })

  public readonly filtersFilterChips$ = computed<Observable<FilterChipData[]>>(() => {
    const filters = this.profile()?.getFilters() ?? []
    if (filters.length > 0) {
      return of(this.filtersFilterChipsService.generateFilterChipsForDataSelectionFilters(filters))
    }
    return of([])
  })

  public readonly profileReferenceChips = computed<FilterChipData[]>(() => {
    const selectedReferenceFields = this.profile()?.getProfileFields()?.getSelectedReferenceFields() ?? []
    return this.getProfileReferenceChips(selectedReferenceFields)
  })

  public ngOnInit(): void {
    this.labelNumber = this.profile()?.getLabelNumber() > 0 ? ' (' + this.profile()?.getLabelNumber() + ')' : ''
    this.label = this.translation.transform(this.profile()?.getLabel()) + this.labelNumber
    this.placeholder = this.translation.transform(this.profile()?.getDisplay()) + this.labelNumber
  }

  public setLabel(label: string) {
    this.updatedLabel.emit(label)
  }

  private getProfileReferenceChips(selectedReferenceFields: SelectedReferenceField[]): FilterChipData[] {
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

    const groups: ProfileReferenceGroup[] = Object.entries(groupedByElementId).map(([elementId, profiles]) => ({ elementId, profiles }))
    return groups.map((group) => FilterChipProfileRefrenceAdapter.adaptToProfileReferenceChipData(group))
  }
}
