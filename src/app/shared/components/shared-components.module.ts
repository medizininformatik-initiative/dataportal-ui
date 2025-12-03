import { ActionBarComponent } from './action-bar/action-bar.component';
import { BreadcrumbComponent } from './breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { CriteriaBoxComponent } from './criteria-box/criteria-box.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DisplayTranslationPipe } from '../pipes/DisplayTranslationPipe';
import { FilterChipsComponent } from './filter-chips/filter-chips.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HeaderDescriptionComponent } from './header-description/header-description.component';
import { LinkedBadgeComponent } from './linked-badge/linked-badge.component';
import { ListItemDetailsComponent } from './list-item-details/list-item-details.component';
import { ListItemDetailsSectionsComponent } from './list-item-details/list-item-details-sections/list-item-details-sections.component';
import { LogicSwitchComponent } from './logic-switch/logic-switch.component';
import { MaterialModule } from 'src/app/layout/material/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuComponent } from './menu/menu.component';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { NgModule } from '@angular/core';
import { PlaceholderBoxComponent } from './placeholder-box/placeholder-box.component';
import { ProfileReferenceTileComponent } from './profile-reference-tile/profile-reference-tile.component';
import { ReferenceCriteriaBoxComponent } from './reference-criteria-box/reference-criteria-box.component';
import { SaveDataQueryModalComponent } from './save-dataquery-modal/save-dataquery-modal.component';
import { SavedQueryTileComponent } from './saved-query-tile/saved-query-tile.component';
import { SaveFileModalComponent } from './save-file-modal/save-file-modal.component';
import { SearchbarComponent } from './search/searchbar.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SearchModeToggleComponent } from './search-mode-toggle/search-mode-toggle.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SectionNameComponent } from './section-name/section-name.component';
import { SelectableReferenceTileComponent } from './selectable-reference-tile/selectable-reference-tile.component';
import { SnackbarComponent } from './snack-bar/snackbar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SwitchComponent } from './switch/switch.component';
import { TableComponent } from './table/table.component';
import { TranslateModule } from '@ngx-translate/core';
import { TreeComponent } from './tree/tree.component';
import { ValueSelectComponent } from './value-select/value-select.component';
import { InformationSectionComponent } from './information-section/information-section.component';

const SHARED_DECLARATIONS = [
  ActionBarComponent,
  ButtonComponent,
  CriteriaBoxComponent,
  DatePickerComponent,
  FilterChipsComponent,
  HeaderComponent,
  HeaderDescriptionComponent,
  ListItemDetailsSectionsComponent,
  ListItemDetailsComponent,
  LogicSwitchComponent,
  MenuComponent,
  ModalWindowComponent,
  SavedQueryTileComponent,
  SearchbarComponent,
  SearchFilterComponent,
  SearchResultComponent,
  SectionNameComponent,
  SpinnerComponent,
  SnackbarComponent,
  SwitchComponent,
  TableComponent,
  TreeComponent,
  ValueSelectComponent,
  BreadcrumbComponent,
  PlaceholderBoxComponent,
  SaveFileModalComponent,
  SaveDataQueryModalComponent,
  DisplayTranslationPipe,
  ProfileReferenceTileComponent,
  LinkedBadgeComponent,
  SelectableReferenceTileComponent,
  SearchModeToggleComponent,
  InformationSectionComponent,
];

@NgModule({
  declarations: [
    ...SHARED_DECLARATIONS,
    ActionBarComponent,
    CriteriaBoxComponent,
    DatePickerComponent,
    HeaderComponent,
    HeaderDescriptionComponent,
    ListItemDetailsSectionsComponent,
    MenuComponent,
    ModalWindowComponent,
    ReferenceCriteriaBoxComponent,
    SavedQueryTileComponent,
    SearchFilterComponent,
    SectionNameComponent,
    SpinnerComponent,
    SnackbarComponent,
    SwitchComponent,
    TreeComponent,
    ValueSelectComponent,
    LogicSwitchComponent,
    BreadcrumbComponent,
    PlaceholderBoxComponent,
    SaveFileModalComponent,
    ConfirmDeleteModalComponent,
    ProfileReferenceTileComponent,
    LinkedBadgeComponent,
    SelectableReferenceTileComponent,
    ListItemDetailsComponent,
    SearchModeToggleComponent,
    InformationSectionComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [...SHARED_DECLARATIONS],
  providers: [DisplayTranslationPipe],
})
export class SharedComponentsModule {}
