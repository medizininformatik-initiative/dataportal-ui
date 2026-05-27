import { Routes } from '@angular/router'

import { PathSegments } from 'src/app/app-paths'
import { DataSelectionProfileResolverService } from 'src/app/service/Resolver/DataSelectionProfileResolver.servcie'

export const DATA_SELECTION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: PathSegments.search,
    pathMatch: 'full',
    data: { animation: 'Data_Selection_Search', title: 'TAB_TITLE.DATA_SELECTION.SEARCH' },
  },
  {
    path: PathSegments.search,
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.SearchDataSelectionComponent),
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
    loadComponent: () =>
      import('./components/editor/display/display.component').then(
        (m) => m.DisplayDataSelectionComponent
      ),
    data: {
      animation: 'Data_Selection_Editor',
      title: 'TAB_TITLE.DATA_SELECTION.EDITOR',
      breadcrumb: 'BREADCRUMB.DATA_SELECTION_EDITOR',
    },
  },
]
