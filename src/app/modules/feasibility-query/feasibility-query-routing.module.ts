import { PathSegments } from 'src/app/app-paths'
import { Routes } from '@angular/router'
import { CriteriaSearchDataResolverService } from 'src/app/service/Resolver/CriteriaSearchDataResolver.service'
import { CriteriaSearchFilterResolverService } from 'src/app/service/Resolver/CriteriaSearchFilterResolver.service'

export const FEASIBILITY_QUERY_ROUTES: Routes = [
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
    loadComponent: () =>
      import('./components/editor/edit.component').then((m) => m.EditFeasibilityQueryComponent),
    data: {
      animation: 'Feasibility_Editor',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.EDITOR',
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY_EDITOR',
    },
  },
  {
    path: PathSegments.result,
    loadComponent: () =>
      import('./components/result/result.component').then((m) => m.ResultComponent),
    data: {
      animation: 'Feasibility_Result',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.RESULT',
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY_RESULT',
    },
  },
  {
    path: PathSegments.search,
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.FeasibilityQuerySearchComponent),
    resolve: {
      preLoadCriteriaData: CriteriaSearchDataResolverService,
      preLoadCriteriaFilter: CriteriaSearchFilterResolverService,
    },
    data: {
      animation: 'Feasibility_Search',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.SEARCH',
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY_SEARCH',
    },
  },
  {
    path: PathSegments.bulkSearch,
    loadComponent: () =>
      import('./components/search/bulk/bulk-search.component').then(
        (m) => m.FeasibilityQueryBulkSearchComponent
      ),
    data: {
      animation: 'Feasibility_Bulk_Search',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.SEARCH',
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY_BULK_SEARCH',
    },
  },
]
