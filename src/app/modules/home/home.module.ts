import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultResultComponent } from './consult/consult-result/consult-result.component';
import { ConsultComponent } from './consult/consult.component';
import { HomeRoutesModule } from './home-routes.module';
import { HomeComponent } from './home.component';
import { IndexComponent } from './index/index.component';
import { ClientDataModalComponent } from './reserve/client-data-modal/client-data-modal.component';
import { ReserveResultComponent } from './reserve/reserve-result/reserve-result.component';
import { ReserveComponent } from './reserve/reserve.component';


@NgModule({
  declarations: [
    HomeComponent,
    IndexComponent,
    ReserveComponent,
    ConsultComponent,
    ConsultResultComponent,
    ClientDataModalComponent,
    ReserveResultComponent,
  ],
  exports: [
    HomeComponent,
    IndexComponent,
    ReserveComponent,
    ConsultComponent,
    ConsultResultComponent,
    ClientDataModalComponent,
    ReserveResultComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutesModule,
  ]
})
export class HomeModule { }
