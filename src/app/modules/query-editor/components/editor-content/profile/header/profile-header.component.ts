import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service';
import { DataSelectionFiltersFilterChips } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFiltersFilterChips.service';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { DisplayTranslationPipe } from '../../../../../../shared/pipes/DisplayTranslationPipe';
import { FilterChipProfileRefrenceAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipProfileRefrenceAdapter';
import { InterfaceFilterChip } from 'src/app/shared/models/FilterChips/InterfaceFilterChip';
import { Observable, of } from 'rxjs';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';
import { ProfileReferenceGroup } from 'src/app/shared/models/FilterChips/ProfileReferenceChipData';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'num-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  providers: [DataSelectionFieldsChipsService, DataSelectionFiltersFilterChips],
})
export class ProfileHeaderComponent implements OnInit, OnChanges {
  @Input()
  profile: DataSelectionProfile;

  @Output()
  updatedLabel: EventEmitter<string> = new EventEmitter<string>();

  label: string;
  placeholder: string;

  filterChipsSelected = false;
  $fieldsFilterChips: Observable<InterfaceFilterChip[]> = of([]);

  filtersFilterChips: InterfaceFilterChip[] = [];
  filtersFilterChips$: Observable<InterfaceFilterChip[]> = of([]);

  profileReferenceChips: InterfaceFilterChip[] = [];

  constructor(
    private profileProviderService: ProfileProviderService,
    private fieldsFilterChipsService: DataSelectionFieldsChipsService,
    private filtersFilterChipsService: DataSelectionFiltersFilterChips,
    private translation: DisplayTranslationPipe
  ) {}

  ngOnInit(): void {
    this.label = this.translation.transform(this.profile.getLabel());
    this.placeholder = this.translation.transform(this.profile.getDisplay());
    this.getProfileFieldsChips(this.profile.getProfileFields().getSelectedBasicFields());
    this.profileReferenceChips = this.getProfileReferenceChips(
      this.profile.getProfileFields().getSelectedReferenceFields()
    );
    this.getProfileFilterChips(this.profile.getFilters());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.profile.currentValue?.getFilters()) {
      this.getProfileFilterChips(changes.profile.currentValue.getFilters());
      const profile: DataSelectionProfile = changes.profile.currentValue;
      this.getProfileFieldsChips(profile.getProfileFields().getSelectedBasicFields());
    }
    this.profileReferenceChips = this.getProfileReferenceChips(
      this.profile.getProfileFields().getSelectedReferenceFields()
    );
    this.label = this.translation.transform(this.profile.getLabel());
    this.placeholder = this.translation.transform(this.profile.getDisplay());
  }

  public getProfileFieldsChips(selectedFields: SelectedBasicField[]): void {
    this.$fieldsFilterChips =
      this.fieldsFilterChipsService.generateFilterChipsFromDataSelectionFields(selectedFields);
  }

  private getProfileFilterChips(filter: AbstractProfileFilter[]): void {
    if (filter.length > 0) {
      this.filtersFilterChips$ = of(
        this.filtersFilterChipsService.generateFilterChipsForDataSelectionFilters(
          this.profile.getFilters()
        )
      );
    } else {
      this.filtersFilterChips$ = of([]); // Emit an empty array if no filters are present
    }
  }
  public setLabel(label: string) {
    this.updatedLabel.emit(label);
  }

  public getProfileReferenceChips(
    selectedReferenceFields: SelectedReferenceField[]
  ): InterfaceFilterChip[] {
    const groupedByElementId = selectedReferenceFields.reduce((acc, ref) => {
      const key = ref.getElementId();
      if (!acc[key]) {
        acc[key] = [];
      }
      const linkedProfiles = ref
        .getLinkedProfileIds()
        .map((id) => this.profileProviderService.getProfileById(id).getDisplay())
        .filter((profileDisplay): profileDisplay is Display => !!profileDisplay);

      acc[key].push(...linkedProfiles);
      return acc;
    }, {} as ProfileReferenceGroup);

    const groups: ProfileReferenceGroup[] = Object.entries(groupedByElementId).map(
      ([elementId, profiles]) => ({ elementId, profiles })
    );
    const chips = groups.map((group) =>
      FilterChipProfileRefrenceAdapter.adaptToProfileReferenceChipData(group)
    );
    return chips;
  }
}
