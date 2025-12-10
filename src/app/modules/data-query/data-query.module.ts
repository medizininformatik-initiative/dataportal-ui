import { CohortDefinitionActionBarComponent } from './data-query/cohort-definition/action-bar/cohort-definition-action-bar.component';
import { CohortDefinitionComponent } from './data-query/cohort-definition/cohort-definition.component';
import { CommonModule } from '@angular/common';
import { DataQueryRoutingModule } from './data-query-routing.module';
import { DataSelectionActionBarComponent } from './data-query/data-selection/action-bar/data-selection-action-bar.component';
import { DataSelectionComponent } from './data-query/data-selection/data-selection.component';
import { DataSelectionModule } from '../data-selection/data-selection.module';
import { DownloadAnnotatedComponent } from './data-query/cohort-definition/download-annotated/download-annotated.component';
import { FeasibilityQueryModule } from '../feasibility-query/feasibility-query.module';
import { FileSaverModule } from 'ngx-filesaver';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from 'src/app/layout/material/material.module';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedFilterModule } from '../shared-filter/shared-filter.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CohortDefinitionComponent,
    DataSelectionComponent,
    DownloadAnnotatedComponent,
    CohortDefinitionActionBarComponent,
    DataSelectionActionBarComponent,
  ],
  exports: [],
  imports: [
    DataQueryRoutingModule,
    CommonModule,
    SharedModule,
    LayoutModule,
    OverlayModule,
    FileSaverModule,
    SharedFilterModule,
    FeasibilityQueryModule,
    DataSelectionModule,
    MaterialModule,
  ],
})
export class DataQueryModule {}
