import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultComponent } from './consult/consult.component';
import { HomeRoutesModule } from './home-routes.module';
import { HomeComponent } from './home.component';
import { IndexComponent } from './index/index.component';
import { ReserveComponent } from './reserve/reserve.component';


@NgModule({
  declarations: [
    HomeComponent,
    IndexComponent,
    ReserveComponent,
    ConsultComponent
  ],
  exports: [
    HomeComponent,
    IndexComponent,
    ReserveComponent,
    ConsultComponent
  ],
  imports: [
    SharedModule,
    HomeRoutesModule,
  ]
})
export class HomeModule { }
