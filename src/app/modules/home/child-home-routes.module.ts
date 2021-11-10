import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConsultComponent } from "./consult/consult.component";
import { IndexComponent } from "./index/index.component";
import { ReserveComponent } from "./reserve/reserve.component";

const childRoutes: Routes = [
  { 
    path: 'index', 
    component: IndexComponent
  },
  { 
    path: 'reserve', 
    component: ReserveComponent
  },
  { 
    path: 'consult', 
    component: ConsultComponent
  },
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildHomeRoutesModule { }
