import { BasePaths } from './app-paths';
import { CriteriaSearchDataResolverService } from './service/Resolver/CriteriaSearchDataResolver.service';
import { CriteriaSearchFilterResolverService } from './service/Resolver/CriteriaSearchFilterResolver.service';
import { DataProtectionComponent } from './site/data-protection/data-protection.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
      import(
        /* webpackChunkName: "QueryEditor.Module" */ './modules/query-editor/query-editor.module'
      ).then((m) => m.QueryEditorModule),
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
      import(
        /* webpackChunkName: "DataQuery.Module" */ './modules/data-query/data-query.module'
      ).then((m) => m.DataQueryModule),
  },
  {
    path: BasePaths.feasibilityQuery,
    resolve: {
      preLoadCriteriaData: CriteriaSearchDataResolverService,
      preLoadCriteriaFilter: CriteriaSearchFilterResolverService,
    },
    data: {
      navId: BasePaths.feasibilityQuery,
      roles: ['main'],
      breadcrumb: 'BREADCRUMB.FEASIBILITY_QUERY',
      animation: 'FeasibilityQueryPage',
      title: 'TAB_TITLE.FEASIBILITY_QUERY.INDEX',
    },
    loadChildren: () =>
      import(
        /* webpackChunkName: "FeasibilityQuery.Module" */ './modules/feasibility-query/feasibility-query.module'
      ).then((m) => m.FeasibilityQueryModule),
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
      import(
        /* webpackChunkName: "DataSelection.Module" */ './modules/data-selection/data-selection.module'
      ).then((m) => m.DataSelectionModule),
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
      import(
        /* webpackChunkName: "SavedQueries.Module" */ './modules/saved-queries/saved-queries.module'
      ).then((m) => m.SavedQueriesModule),
  },
  {
    path: 'data-protection',
    component: DataProtectionComponent,
    data: {
      breadcrumb: 'BREADCRUMB.DATA_PROTECTION',
      animation: 'DataProtectionPage',
      title: 'TAB_TITLE.DATA_PROTECTION',
    },
  },
  { path: '', redirectTo: BasePaths.dataQuery, pathMatch: 'full' },
  { path: '**', redirectTo: BasePaths.dataQuery, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
