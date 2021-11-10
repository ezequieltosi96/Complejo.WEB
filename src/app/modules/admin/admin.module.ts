import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFieldComponent } from './admin-field/admin-field.component';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';
import { AdminRoutesModule } from './admin-routes.module';
import { AdminTurnComponent } from './admin-turn/admin-turn.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { CreateUpdateAdminUserComponent } from './admin-user/create-update-admin-user/create-update-admin-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';



@NgModule({
  declarations: [
    DashboardComponent,
    SideBarComponent,
    AdminUserComponent,
    AdminFieldComponent,
    AdminTurnComponent,
    AdminNavBarComponent,
    CreateUpdateAdminUserComponent,
  ],
  exports: [
    DashboardComponent,
    SideBarComponent,
    AdminUserComponent,
    AdminFieldComponent,
    AdminTurnComponent,
    AdminNavBarComponent,
    CreateUpdateAdminUserComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutesModule
  ]
})
export class AdminModule { }
