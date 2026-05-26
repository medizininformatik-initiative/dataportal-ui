import { Routes } from '@angular/router'
import { PathSegments } from 'src/app/app-paths'

import { RouteGuard } from 'src/app/core/auth/guards/route.guard.service'

export const QUERY_EDITOR_ROUTES: Routes = [
  {
    path: `${PathSegments.criterion}/:id`,
    loadComponent: () =>
      import('./components/query-editor.component').then((m) => m.QueryEditorComponent),
    data: {
      breadcrumb: 'BREADCRUMB.QUERY_EDITOR',
      hideSideNav: false,
      title: 'TAB_TITLE.QUERY_EDITOR_CRITERION',
    },
    canActivate: [RouteGuard],
  },
  {
    path: `${PathSegments.feature}/:id`,
    loadComponent: () =>
      import('./components/query-editor.component').then((m) => m.QueryEditorComponent),
    data: {
      hideSideNav: false,
      breadcrumb: 'BREADCRUMB.DATA_SELECTION',
      title: 'TAB_TITLE.QUERY_EDITOR_FEATURE',
    },
    canActivate: [RouteGuard],
  },
  {
    path: `${PathSegments.reference}/:id`,
    loadComponent: () =>
      import('./components/query-editor.component').then((m) => m.QueryEditorComponent),
    data: {
      hideSideNav: false,
      breadcrumb: 'BREADCRUMB.QUERY_EDITOR',
      title: 'TAB_TITLE.QUERY_EDITOR_REFERENCE',
    },
    canActivate: [RouteGuard],
  },
]
