import { CommonModule } from '@angular/common'
import { CriterionComponent } from './components/editor-content/criterion/criterion.component'
import { CriterionHeaderComponent } from './components/editor-content/criterion/header/criterion-header.component'
import { DataSelectionModule } from '../data-selection/data-selection.module'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { EditActionBarComponent } from './components/action-bar/edit-action-bar.component'
import { EditorContentComponent } from './components/editor-content/editor-content.component'
import { FeasibilityQueryModule } from '../feasibility-query/feasibility-query.module'
import { FilterTabsComponent } from './components/editor-content/filter-tabs/filter-tabs.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MaterialModule } from 'src/app/layout/material/material.module'
import { NgModule } from '@angular/core'
import { OverlayModule } from '@angular/cdk/overlay'
import { PossibleReferencesComponent } from './components/editor-content/profile/reference/possible-references/possible-references.component'
import { ProfileComponent } from './components/editor-content/profile/profile.component'
import { ProfileHeaderComponent } from './components/editor-content/profile/header/profile-header.component'
import { ProfileReferenceComponent } from './components/editor-content/profile/reference/profile-reference.component'
import { ProfileReferenceModalComponent } from './components/editor-content/profile/reference/modal-window/profile-reference-modal.component'
import { ProfileTimeFilterComponent } from './components/editor-content/profile/profile-filter/profile-time-restriction/profile-time-filter.component'
import { QueryEditorComponent } from './components/query-editor.component'
import { QueryEditorRoutingModule } from './query-editor.routing.module'
import { ReferenceEditComponent } from './components/editor-content/reference/reference-edit.component'
import { ReferenceFieldTabComponent } from './components/editor-content/profile/reference/reference-field-tab/reference-field-tab.component'
import { SharedFilterModule } from '../shared-filter/shared-filter.module'
import { SharedModule } from 'src/app/shared/shared.module'
import { TokenFilterComponent } from './components/editor-content/profile/profile-filter/token-filter/token-filter.component'
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter'

export const FORMATS_GERMAN = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

@NgModule({
  imports: [
    CommonModule,
    QueryEditorRoutingModule,
    SharedModule,
    OverlayModule,
    SharedFilterModule,
    FlexLayoutModule,
    MaterialModule,
    FeasibilityQueryModule,
    DataSelectionModule,
    FontAwesomeModule,
  ],
  declarations: [
    EditActionBarComponent,
    EditorContentComponent,
    CriterionComponent,
    FilterTabsComponent,
    ProfileComponent,
    ProfileHeaderComponent,
    QueryEditorComponent,
    TokenFilterComponent,
    ProfileTimeFilterComponent,
    ProfileReferenceComponent,
    ProfileReferenceModalComponent,
    ReferenceFieldTabComponent,
    PossibleReferencesComponent,
    CriterionHeaderComponent,
    ReferenceEditComponent,
  ],
  exports: [],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMATS_GERMAN },
  ],
})
export class QueryEditorModule {}
