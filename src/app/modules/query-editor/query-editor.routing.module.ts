import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathSegments } from 'src/app/app-paths';
import { QueryEditorComponent } from './components/query-editor.component';
import { RouteGuard } from 'src/app/core/auth/guards/route.guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: PathSegments.search,
    pathMatch: 'full',
  },
  {
    path: `${PathSegments.criterion}/:id`,
    component: QueryEditorComponent,
    canActivate: [RouteGuard],
  },
  {
    path: `${PathSegments.feature}/:id`,
    component: QueryEditorComponent,
    data: { hideSideNav: false },
    canActivate: [RouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryEditorRoutingModule {}
