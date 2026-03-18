import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedQueriesComponent } from './components/saved-queries.component';

const routes: Routes = [
  {
    path: '',
    component: SavedQueriesComponent,
    data: { title: 'TAB_TITLE.SAVED_QUERIES', breadcrumb: 'BREADCRUMB.SAVED_QUERIES' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedQueriesRoutingModule {}
