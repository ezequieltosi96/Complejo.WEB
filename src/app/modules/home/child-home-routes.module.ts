import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConsultResultComponent } from "./consult/consult-result/consult-result.component";
import { ConsultComponent } from "./consult/consult.component";
import { IndexComponent } from "./index/index.component";
import { ReserveResultComponent } from "./reserve/reserve-result/reserve-result.component";
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
    path: 'reserve/result', 
    component: ReserveResultComponent
  },
  { 
    path: 'consult', 
    component: ConsultComponent
  },
  { 
    path: 'consult/:code', 
    component: ConsultResultComponent
  },
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildHomeRoutesModule { }
