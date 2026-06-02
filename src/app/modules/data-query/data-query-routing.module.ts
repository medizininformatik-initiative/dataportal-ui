import { LoadQueryIntoEditorFromUrlService } from 'src/app/service/Resolver/LoadQueryIntoEditorFromUrl.service'
import { PathSegments } from 'src/app/app-paths'
import { Routes } from '@angular/router'

export const DATA_QUERY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: PathSegments.cohortDefinition,
    pathMatch: 'full',
    data: { animation: 'Search', title: 'TAB_TITLE.DATA_QUERY.COHORT_DEFINITION' },
  },
  {
    path: PathSegments.loadQuery,
    resolve: {
      preLoadedQuery: LoadQueryIntoEditorFromUrlService,
    },
    loadComponent: () =>
      import('./data-query/cohort-definition/cohort-definition.component').then(
        (m) => m.CohortDefinitionComponent
      ),
    data: {
      animation: 'Cohort',
      title: 'TAB_TITLE.DATA_QUERY.COHORT_DEFINITION',
      breadcrumb: 'BREADCRUMB.DATA_QUERY_COHORT_DEFINITION',
    },
  },
  {
    path: PathSegments.cohortDefinition,
    loadComponent: () =>
      import('./data-query/cohort-definition/cohort-definition.component').then(
        (m) => m.CohortDefinitionComponent
      ),
    data: {
      animation: 'Cohort',
      title: 'TAB_TITLE.DATA_QUERY.COHORT_DEFINITION',
      breadcrumb: 'BREADCRUMB.DATA_QUERY_COHORT_DEFINITION',
    },
  },
  {
    path: PathSegments.dataSelection,
    loadComponent: () =>
      import('./data-query/data-selection/data-selection.component').then(
        (m) => m.DataSelectionComponent
      ),
    data: {
      animation: 'DataSelection',
      title: 'TAB_TITLE.DATA_QUERY.DATA_SELECTION',
      breadcrumb: 'BREADCRUMB.DATA_QUERY_DATA_SELECTION',
    },
  },
]
