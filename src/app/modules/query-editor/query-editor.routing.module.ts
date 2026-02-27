import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathSegments } from 'src/app/app-paths';
import { QueryEditorComponent } from './components/query-editor.component';
import { RouteGuard } from 'src/app/core/auth/guards/route.guard.service';

const routes: Routes = [
  {
    path: `${PathSegments.criterion}/:id`,
    component: QueryEditorComponent,
    data: { title: 'TAB_TITLE.QUERY_EDITOR_CRITERION', breadcrumb: 'BREADCRUMB.QUERY_EDITOR' },
    canActivate: [RouteGuard],
  },
  {
    path: `${PathSegments.feature}/:id`,
    component: QueryEditorComponent,
    data: {
      hideSideNav: false,
      breadcrumb: 'BREADCRUMB.DATA_SELECTION',
      title: 'TAB_TITLE.QUERY_EDITOR_FEATURE',
    },
    canActivate: [RouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryEditorRoutingModule {}
