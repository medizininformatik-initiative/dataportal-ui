import { CommonModule } from '@angular/common';
import { ConceptBulkSearchComponent } from './components/concept-bulk-search/concept-bulk-search.component';
import { ConceptFilterComponent } from './components/concept/concept-filter.component';
import { SearchConceptComponent } from './components/concept/search-concept/search-concept.component';
import { EditFieldsComponent } from './components/edit-fields/edit-fields.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LayoutModule } from 'src/app/layout/layout.module';
import { NgModule } from '@angular/core';
import { SelectedConceptListComponent } from './components/concept/selected-concept-list/selected-concept-list.component';
import { SelectedReferenceListComponent } from './components/selected-reference-list/selected-reference-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConceptFilterTableComponent } from './components/concept/concept-filter-table/concept-filter-table.component';

@NgModule({
  declarations: [
    EditFieldsComponent,
    SearchConceptComponent,
    ConceptFilterComponent,
    ConceptBulkSearchComponent,
    ConceptFilterTableComponent,
    SelectedConceptListComponent,
    SelectedReferenceListComponent,
  ],
  imports: [CommonModule, LayoutModule, SharedModule, InfiniteScrollModule],
  exports: [
    EditFieldsComponent,
    ConceptFilterComponent,
    ConceptBulkSearchComponent,
    SelectedConceptListComponent,
    SelectedReferenceListComponent,
  ],
})
export class SharedFilterModule {}
