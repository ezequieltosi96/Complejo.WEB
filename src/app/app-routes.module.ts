import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './modules/home/profile/profile.component';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';

const routes: Routes = [ 
  {path: '', redirectTo: '/home/index', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '**', component: NoPageFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule { }
