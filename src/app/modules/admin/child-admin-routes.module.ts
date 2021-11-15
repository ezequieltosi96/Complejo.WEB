import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminFieldComponent } from "./admin-field/admin-field.component";
import { CreateUpdateFieldComponent } from "./admin-field/create-update-field/create-update-field.component";
import { AdminTurnComponent } from "./admin-turn/admin-turn.component";
import { CreateAdminTurnComponent } from "./admin-turn/create-admin-turn/create-admin-turn.component";
import { AdminUserComponent } from "./admin-user/admin-user.component";
import { CreateUpdateAdminUserComponent } from "./admin-user/create-update-admin-user/create-update-admin-user.component";

const childRoutes: Routes = [
  { 
    path: 'fields',
    component: AdminFieldComponent
  },
      {
        path: 'fields/new',
        component: CreateUpdateFieldComponent
      },
      {
        path: 'fields/edit/:id',
        component: CreateUpdateFieldComponent
      },
  { 
    path: 'turns',
    component: AdminTurnComponent
  },
      { 
        path: 'turns/new',
        component: CreateAdminTurnComponent
      },
  { 
    path: 'users',
    component: AdminUserComponent
  },
      {
        path: 'users/new',
        component: CreateUpdateAdminUserComponent
      }
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildAdminRoutesModule { }
