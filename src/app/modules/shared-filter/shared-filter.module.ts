import { CommonModule } from '@angular/common';
import { ConceptBulkSearchComponent } from './components/concept-bulk-search/concept-bulk-search.component';
import { ConceptFilterTableComponent } from './components/shared-concept-filter/concept-filter-table/concept-filter-table.component';
import { EditFieldsComponent } from './components/edit-fields/edit-fields.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { SearchConceptComponent } from './components/shared-concept-filter/search-concept/search-concept.component';
import { SelectedConceptListComponent } from './components/shared-concept-filter/selected-concept-list/selected-concept-list.component';
import { SharedConceptFilterComponent } from './components/shared-concept-filter/shared-concept-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StagedConceptsComponent } from './components/shared-concept-filter/staged-concepts/staged-concepts.component';
import { CopyConceptFilterTableComponent } from './components/shared-concept-filter copy/concept-filter-table/copy_concept-filter-table.component';
import { CopySearchConceptComponent } from './components/shared-concept-filter copy/search-concept/copy_search-concept.component';
import { CopySharedConceptFilterComponent } from './components/shared-concept-filter copy/copy_shared-concept-filter.component';

@NgModule({
  declarations: [
    SharedConceptFilterComponent,
    StagedConceptsComponent,
    ConceptFilterTableComponent,
    SearchConceptComponent,
    EditFieldsComponent,
    CopyConceptFilterTableComponent,
    CopySearchConceptComponent,
    CopySharedConceptFilterComponent,
    ConceptBulkSearchComponent,
    SelectedConceptListComponent,
  ],
  imports: [CommonModule, LayoutModule, SharedModule, InfiniteScrollModule],
  exports: [
    SharedConceptFilterComponent,
    EditFieldsComponent,
    CopySharedConceptFilterComponent,
    ConceptBulkSearchComponent,
    SelectedConceptListComponent,
  ],
})
export class SharedFilterModule {}
