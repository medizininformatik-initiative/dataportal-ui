import { CommonModule } from '@angular/common';
import { ConceptBulkSearchComponent } from './components/concept-bulk-search/concept-bulk-search.component';
import { EditFieldsComponent } from './components/edit-fields/edit-fields.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectedConceptListComponent } from './components/shared-concept-filter copy/selected-concept-list/selected-concept-list.component';
import { CopySearchConceptComponent } from './components/shared-concept-filter copy/search-concept/copy_search-concept.component';
import { CopySharedConceptFilterComponent } from './components/shared-concept-filter copy/copy_shared-concept-filter.component';
import { CopyConceptFilterTableComponent } from './components/shared-concept-filter copy/concept-filter-table/copy_concept-filter-table.component';
import { SelectedReferenceListComponent } from './components/shared-concept-filter copy/selected-reference-list/selected-reference-list.component';

@NgModule({
  declarations: [
    EditFieldsComponent,
    CopySearchConceptComponent,
    CopySharedConceptFilterComponent,
    ConceptBulkSearchComponent,
    CopyConceptFilterTableComponent,
    SelectedConceptListComponent,
    SelectedReferenceListComponent,
  ],
  imports: [CommonModule, LayoutModule, SharedModule, InfiniteScrollModule],
  exports: [
    EditFieldsComponent,
    CopySharedConceptFilterComponent,
    ConceptBulkSearchComponent,
    SelectedConceptListComponent,
    SelectedReferenceListComponent,
  ],
})
export class SharedFilterModule {}
