import { DisplayDataSelectionComponent } from './components/editor/display/display.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchDataSelectionComponent } from './components/search/search.component';
import { PathSegments } from 'src/app/app-paths';
import { DataSelectionProfileResolverService } from 'src/app/service/Resolver/DataSelectionProfileResolver.servcie';

const routes: Routes = [
  {
    path: '',
    redirectTo: PathSegments.search,
    pathMatch: 'full',
    data: { animation: 'Data_Selection_Search', title: 'TAB_TITLE.DATA_SELECTION.SEARCH' },
  },
  {
    path: PathSegments.search,
    component: SearchDataSelectionComponent,
    resolve: {
      preLoadDataSelectionData: DataSelectionProfileResolverService,
    },
    data: {
      animation: 'Data_Selection_Search',
      title: 'TAB_TITLE.DATA_SELECTION.SEARCH',
      breadcrumb: 'BREADCRUMB.DATA_SELECTION_SEARCH',
    },
  },
  {
    path: PathSegments.editor,
    component: DisplayDataSelectionComponent,
    data: {
      animation: 'Data_Selection_Editor',
      title: 'TAB_TITLE.DATA_SELECTION.EDITOR',
      breadcrumb: 'BREADCRUMB.DATA_SELECTION_EDITOR',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataSelectionRoutingModule {}
