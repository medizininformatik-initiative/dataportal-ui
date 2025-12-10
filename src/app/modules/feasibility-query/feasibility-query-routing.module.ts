import { EditFeasibilityQueryComponent } from './components/editor/edit.component';
import { FeasibilityQuerySearchComponent } from './components/search/search.component';
import { NgModule } from '@angular/core';
import { PathSegments } from 'src/app/app-paths';
import { ResultComponent } from './components/result/result.component';
import { RouterModule, Routes } from '@angular/router';
import { FeasibilityQueryBulkSearchComponent } from './components/search/bulk/bulk-search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PathSegments.search,
    pathMatch: 'full',

    data: {
      animation: 'Feasibility_Search',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.SEARCH',
    },
  },
  {
    path: PathSegments.editor,
    component: EditFeasibilityQueryComponent,
    data: {
      animation: 'Feasibility_Editor',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.EDITOR',
    },
  },
  {
    path: PathSegments.result,
    component: ResultComponent,
    data: {
      animation: 'Feasibility_Result',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.RESULT',
    },
  },
  {
    path: PathSegments.search,
    component: FeasibilityQuerySearchComponent,
    data: {
      animation: 'Feasibility_Search',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.SEARCH',
    },
  },
  {
    path: PathSegments.bulkSearch,
    component: FeasibilityQueryBulkSearchComponent,
    data: {
      animation: 'Feasibility_Bulk_Search',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.SEARCH',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeasibilityQueryRoutingModule {}
