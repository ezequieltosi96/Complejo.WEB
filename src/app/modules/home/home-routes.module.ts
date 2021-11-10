import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes : Routes = [
  { 
    path: 'home', 
    component: HomeComponent,
    loadChildren: () => import('./child-home-routes.module').then(m => m.ChildHomeRoutesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class HomeRoutesModule { }
