import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { CreateReservationLoggedInClientCommand } from 'src/app/gateway/commands/turn/create-reservation-logged-in-client.command';
import { CreateReservationUnregisteredClientCommand } from 'src/app/gateway/commands/turn/create-reservation-unregistered-client.command';
import { GetAllFieldForNewReservationQuery } from 'src/app/gateway/querys/field/all-field-for-new-reservation.query';
import { FieldById } from 'src/app/models/field/field-by-id';
import { UserContext } from 'src/app/models/security/user-context';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { DataService } from 'src/app/services/data.service';
import { FieldService } from 'src/app/services/field.service';
import { TurnService } from 'src/app/services/turn.service';
import { isNullOrUndefined } from 'src/app/shared/utils/functions.utils';
import { ClientDataModalComponent } from '../client-data-modal/client-data-modal.component';

@Component({
  selector: 'app-reserve-result',
  templateUrl: './reserve-result.component.html',
  styleUrls: ['./reserve-result.component.css']
})
export class ReserveResultComponent implements OnInit {

  public data: any;
  private userContext!: UserContext;

  public fields: FieldById[] = [];
  public fieldType!: string;

  constructor(private readonly dataService: DataService,
              private readonly bService: BaseComponentService,
              private readonly fieldService: FieldService,
              private readonly authService: AuthService,
              private readonly turnService: TurnService) { 

                if(isNullOrUndefined(this.dataService.reserveParams)) {
                  this.bService.router.navigate(['home/reserve']);
                }

              }

  ngOnInit(): void {
    this.startLoading();

    this.data = this.dataService.reserveParams;

    if(this.authService.isLoggedIn()) {
      this.userContext = this.authService.getUserContext()!;
    }

    let promises = [];

    promises.push(this.getFieldForNewReservationPromise(this.data));

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .finally(() => this.stopLoading());
  }

  getFieldForNewReservationPromise(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldForNewReservation(new GetAllFieldForNewReservationQuery(data.idFieldType, data.date, data.time)).subscribe(
        res => {
          this.fields = res;
          this.fieldType = this.fields[0].type;
          resolve();
        },
        err => {
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  finalizeReservation(idField: string) {
    if(!isNullOrUndefined(this.userContext) && !isNullOrUndefined(this.userContext.idClient)) {
      this.createReservationLoggedInClient(idField);
    }
    else {
      this.openModal(idField);
    }
  }

  openModal(idField: string) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = false;
    config.autoFocus = false;
    config.maxWidth = '80%';
    config.width = '800px';

    this.bService.matDialog.open(ClientDataModalComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          this.createReservationUnregisteredClient(idField, res.data);
        }
      }
    );
  }

  createReservationLoggedInClient(idField: string) {
    this.startLoading();
    const idClient = this.userContext.idClient;
    const date = this.data.date;
    const time = this.data.time;

    const command = new CreateReservationLoggedInClientCommand(idClient!, date, time, idField);

    this.turnService.CreateReservationLoggedInClient(command).subscribe(
      res => {
        this.stopLoading();
        this.bService.toastr.success('Reserva creada', 'Éxito!');
        this.bService.router.navigate([`home/consult/${res}`]);
      },
      err => {
        console.log(err);
        const error = this.bService.handleErrorMessage(err);
        this.stopLoading();
        this.bService.toastr.error(error.message, error.title);
        this.bService.router.navigate(['home/index']);
      }
    );
  }

  createReservationUnregisteredClient(idField: string, clientData: any) {
    this.startLoading();
    const date = this.data.date;
    const time = this.data.time;
    const name = clientData.Name;
    const lastName = clientData.LastName;
    const phoneNumber = clientData.PhoneNumber;
    const email = clientData.Email;
    const dni = clientData.Dni;

    const command = new CreateReservationUnregisteredClientCommand(name, lastName, dni, phoneNumber, email, date, time, idField);

    this.turnService.CreateReservationUnregisteredClient(command).subscribe(
      res => {
        this.stopLoading();
        this.bService.toastr.success('Reserva creada', 'Éxito!');
        this.bService.router.navigate([`home/consult/${res}`]);
      },
      err => {
        console.log(err);
        const error = this.bService.handleErrorMessage(err);
        this.stopLoading();
        this.bService.toastr.error(error.message, error.title);
        this.bService.router.navigate(['home/index']);
      }
    );
  }

  private startLoading(){
    this.bService.spinner.show();
  }

  private stopLoading(){
    this.bService.spinner.hide();
  }
}
