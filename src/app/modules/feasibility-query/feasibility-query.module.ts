import { AllowedUnitsComponent } from './components/editor/criterion-modal/quantity/allowed-units/allowed-units.component';
import { AttributeFilterComponent } from './components/editor/criterion-modal/attribute-filter/attribute-filter.component';
import { BeforeFilterComponent } from './components/editor/criterion-modal/time-restriction/before-filter/before-filter.component';
import { BetweenFilterComponent } from './components/editor/criterion-modal/time-restriction/between-filter/between-filter.component';
import { BoolLogicSwitchComponent } from './components/editor/display/bool-logic-switch/bool-logic-switch.component';
import { BulkSearchActionBarComponent } from './components/search/action-bar/bulk-search/bulk-search-action-bar.component';
import { CommonModule } from '@angular/common';
import { ConceptComponent } from './components/editor/criterion-modal/concept/concept.component';
import { ConsentSwitchesComponent } from './components/editor/stage/consent-switches/consent-switches.component';
import { CriteriaStageComponent } from './components/editor/stage/criteria-stage.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DisplayCriteriaComponent } from './components/editor/display/display-criteria/display-criteria.component';
import { DisplayFeasibilityQueryComponent } from './components/editor/display/display.component';
import { EditCriterionModalComponent } from './components/editor/criterion-modal/edit-criterion-modal.component';
import { EditFeasibilityQueryComponent } from './components/editor/edit.component';
import { EditorActionBarComponent } from './components/editor/action-bar/editor-action-bar.component';
import { EditReferenceCriteriaModalComponent } from './components/editor/reference-criteria-modal/edit-reference-criteria-modal.component';
import { EditTimeRestrictionComponent } from './components/editor/criterion-modal/time-restriction/edit-time-restriction.component';
import { FeasibilityQueryBulkSearchComponent } from './components/search/bulk/bulk-search.component';
import { FeasibilityQueryRoutingModule } from './feasibility-query-routing.module';
import { FeasibilityQuerySearchComponent } from './components/search/search.component';
import { FileSaverModule } from 'ngx-filesaver';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LayoutModule } from 'src/app/layout/layout.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { QuantityComparatorComponent } from './components/editor/criterion-modal/quantity/quantity-comparator/quantity-comparator.component';
import { QuantityComparisionSelectComponent } from './components/editor/criterion-modal/quantity/quantity-comparision-select/quantity-comparision-select.component';
import { QuantityComponent } from './components/editor/criterion-modal/quantity/quantity.component';
import { QuantityRangeComponent } from './components/editor/criterion-modal/quantity/quantity-range/quantity-range.component';
import { ReferenceComponent } from './components/editor/reference-criteria-modal/reference/reference.component';
import { ResultActionBarComponent } from './components/result/action-bar/result-action-bar.component';
import { ResultComponent } from './components/result/result.component';
import { ResultDetailModalComponent } from './components/result/result-detail-modal/result-detail-modal.component';
import { SaveQueryModalComponent } from './components/result/save-dialog/save-dialog.component';
import { SearchActionBarComponent } from './components/search/action-bar/search/search-action-bar.component';
import { SharedFilterModule } from '../shared-filter/shared-filter.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleResultComponent } from './components/result/simple-result/simple-result.component';
import { TermcodeComponent } from './components/editor/criterion-modal/termCode/termcode.component';
import { TimerestrictionTypeSelectorComponent } from './components/editor/criterion-modal/time-restriction/timerestriction-type-selector/timerestriction-type-selector.component';
import { ValueFilterComponent } from './components/editor/criterion-modal/value-filter/value-filter.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

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
};

@NgModule({
  declarations: [
    BoolLogicSwitchComponent,
    EditFeasibilityQueryComponent,
    EditorActionBarComponent,
    CriteriaStageComponent,
    EditCriterionModalComponent,
    EditReferenceCriteriaModalComponent,
    SimpleResultComponent,
    ResultComponent,
    BeforeFilterComponent,
    BetweenFilterComponent,
    AllowedUnitsComponent,
    QuantityComparisionSelectComponent,
    ReferenceComponent,
    AttributeFilterComponent,
    ValueFilterComponent,
    QuantityRangeComponent,
    QuantityComparatorComponent,
    ConceptComponent,
    QuantityComponent,
    ResultDetailModalComponent,
    EditTimeRestrictionComponent,
    SaveQueryModalComponent,
    TimerestrictionTypeSelectorComponent,
    ConsentSwitchesComponent,
    FeasibilityQuerySearchComponent,
    DisplayFeasibilityQueryComponent,
    SearchActionBarComponent,
    DisplayCriteriaComponent,
    ResultActionBarComponent,
    FeasibilityQueryBulkSearchComponent,
    BulkSearchActionBarComponent,
    TermcodeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    OverlayModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FileSaverModule,
    SharedFilterModule,
    FeasibilityQueryRoutingModule,
    InfiniteScrollModule,
  ],
  exports: [
    EditTimeRestrictionComponent,
    FeasibilityQuerySearchComponent,
    DisplayCriteriaComponent,
    DisplayFeasibilityQueryComponent,
    ConceptComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMATS_GERMAN },
  ],
})
export class FeasibilityQueryModule {}
