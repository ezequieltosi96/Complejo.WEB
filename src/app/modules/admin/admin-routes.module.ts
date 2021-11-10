import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes : Routes = [
  { 
    path: 'admin',
    component: DashboardComponent,
    loadChildren: () => import('./child-admin-routes.module').then(m => m.ChildAdminRoutesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AdminRoutesModule { }
