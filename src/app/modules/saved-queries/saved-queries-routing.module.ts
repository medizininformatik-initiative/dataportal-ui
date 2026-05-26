import { Routes } from '@angular/router'

export const SAVED_QUERIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/saved-queries.component').then((m) => m.SavedQueriesComponent),
    data: { title: 'TAB_TITLE.SAVED_QUERIES', breadcrumb: 'BREADCRUMB.SAVED_QUERIES' },
  },
]
