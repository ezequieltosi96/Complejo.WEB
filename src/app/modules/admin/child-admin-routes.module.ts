import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminUserComponent } from "./admin-user/admin-user.component";
import { CreateUpdateAdminUserComponent } from "./admin-user/create-update-admin-user/create-update-admin-user.component";

const childRoutes: Routes = [
  { 
    path: 'fields',
  },
  { 
    path: 'turns',
  },
  // { 
  //   path: 'users',
  //   loadChildren: () => import('./admin-user/admin-user-routes.module').then(m => m.AdminUserRoutesModule)
  // },
  { 
    path: 'users',
    component: AdminUserComponent
  },
  {
    path: 'users/new',
    component: CreateUpdateAdminUserComponent
  },
  {
    path: 'users/edit/:id',
    component: CreateUpdateAdminUserComponent
  },
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildAdminRoutesModule { }
