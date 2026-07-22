import { BasePaths } from './app-paths'
import { CriteriaSearchDataResolverService } from './service/Resolver/CriteriaSearchDataResolver.service'
import { CriteriaSearchFilterResolverService } from './service/Resolver/CriteriaSearchFilterResolver.service'

import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'home',
    redirectTo: BasePaths.dataQuery,
  },
  {
    path: BasePaths.queryEditor,
    data: {
      hideSideNav: false,
      navId: BasePaths.queryEditor,
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.QUERY_EDITOR',
      title: 'TAB_TITLE.QUERY_EDITOR',
      animation: 'QueryEditorPage',
    },
    loadChildren: () =>
      import('./modules/query-editor/query-editor.routing.module').then(
        (m) => m.QUERY_EDITOR_ROUTES
      ),
  },
  {
    path: BasePaths.dataQuery,
    data: {
      navId: BasePaths.dataQuery,
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.DATA_QUERY',
      animation: 'HomePage',
      title: 'TAB_TITLE.DATA_QUERY.INDEX',
    },
    loadChildren: () =>
      import('./modules/data-query/data-query-routing.module').then((m) => m.DATA_QUERY_ROUTES),
  },
  {
    path: BasePaths.feasibilityQuery,
    data: {
      navId: BasePaths.feasibilityQuery,
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY',
      animation: 'FeasibilityQueryPage',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.INDEX',
    },
    loadChildren: () =>
      import('./modules/feasibility-query/feasibility-query-routing.module').then(
        (m) => m.FEASIBILITY_QUERY_ROUTES
      ),
  },
  {
    path: BasePaths.dataSelection,
    data: {
      navId: BasePaths.dataSelection,
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.DATA_SELECTION',
      animation: 'DataSelectionPage',
      title: 'TAB_TITLE.DATA_SELECTION.INDEX',
    },
    loadChildren: () =>
      import('./modules/data-selection/data-selection-routing.module').then(
        (m) => m.DATA_SELECTION_ROUTES
      ),
  },
  {
    path: 'saved-queries',
    data: {
      navId: 'saved-queries',
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.SAVED_QUERIES',
      animation: 'SavedQueriesPage',
      title: 'TAB_TITLE.SAVED_QUERIES',
    },
    loadChildren: () =>
      import('./modules/saved-queries/saved-queries-routing.module').then(
        (m) => m.SAVED_QUERIES_ROUTES
      ),
  },
  {
    path: 'data-protection',
    loadComponent: () =>
      import('./site/data-protection/data-protection.component').then(
        (m) => m.DataProtectionComponent
      ),
    data: {
      breadcrumb: 'BREADCRUMB.DATA_PROTECTION',
      animation: 'DataProtectionPage',
      title: 'TAB_TITLE.DATA_PROTECTION',
    },
  },
  { path: '', redirectTo: BasePaths.dataQuery, pathMatch: 'full' },
  { path: '**', redirectTo: BasePaths.dataQuery, pathMatch: 'full' },
]
