import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { CreateTurnAdminCommand } from 'src/app/gateway/commands/turn/create-turn-admin.command';
import { GetAllAvailableFieldByDateTimeQuery } from 'src/app/gateway/querys/turn/available-field-by-date-time.query';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { TurnService } from 'src/app/services/turn.service';
import { Regex } from 'src/app/shared/utils/enums.utils';
import { isNullOrUndefined } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-create-admin-turn',
  templateUrl: './create-admin-turn.component.html',
  styleUrls: ['./create-admin-turn.component.css']
})
export class CreateAdminTurnComponent implements OnInit {

  public fields: ComboBox[] = [];
  public times: ComboBox[] = [];

  public loading: boolean = true;
  public title: string = 'Nuevo turno';

  //#region Form
  public today: string = new Date().toISOString().split('T')[0];
  public formErrorMessage: string = 'Formulario invalido.';
  public url: string = '/admin/turns';

  public submitted: boolean = false;
  public isValid: boolean = true;
  public isValidDate: boolean = true;
  public isValidTime: boolean = true;
  public isValidField: boolean = true;
  public isValidClientName: boolean = true;
  public isValidClientLastName: boolean = true;
  public isValidClientDni: boolean = true;
  public isValidClientPhoneNumber: boolean = true;
  public isValidClientEmail: boolean = true;
  //#endregion

  public form: FormGroup = this.bService.formBuilder.group({
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    idField: ['', [Validators.required]],
    clientName: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
    clientLastName: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
    clientDni: ['', [Validators.required, Validators.pattern(Regex.NUMBERS), Validators.minLength(8), Validators.maxLength(8)]],
    clientPhoneNumber: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(Regex.NUMBERS)]],
    clientEmail: ['', [Validators.required, Validators.email]]
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly turnService: TurnService) { }

  ngOnInit(): void {
    this.startLoading();

    let promises: Promise<void>[] = [];

    promises.push(this.getAllValidTimesPromise());
    promises.push(this.getAllAvailableFieldByDateTimePromise(null, null));

    this.resolvePromises(promises);  
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .finally(() => this.stopLoading());
  }

  getAllAvailableFieldByDateTimePromise(date: Date | null, time: string | null) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.turnService.GetAllAvailableFieldByDateTime(new GetAllAvailableFieldByDateTimeQuery(date, time)).subscribe(
        res => {
          this.fields = res;
          resolve();
        },
        err => {
          this.fields = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  getAllValidTimesPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.turnService.GetValidTimesForReservation().subscribe(
        res => {
          this.times = res;
          resolve();
        },
        err => {
          this.times = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  onChangeDate(date: string) {
    if(!isNullOrUndefined(date) && date != '' && this.form.value.time != ''){
      this.updateFieldsCombo(this.form.value.date, this.form.value.time);
    }
  }

  onChangeTime(time: string) {
    if(!isNullOrUndefined(time) && time != '' && this.form.value.date != ''){
      this.updateFieldsCombo(this.form.value.date, time);
    }
  }

  updateFieldsCombo(date: Date, time: string) {
    this.startLoading();
    this.getAllAvailableFieldByDateTimePromise(date, time)
      .finally(() => this.stopLoading());
  }

  goBack(){
    this.bService.router.navigate([this.url]);
  }

  formSubmit(){
    this.submitted = true;
    
    if(this.form.invalid){
      this.isValid = false;
      this.isValidDate = this.form.controls['date'].valid;
      this.isValidTime = this.form.controls['time'].valid;
      this.isValidField = this.form.controls['idField'].valid;
      this.isValidClientName = this.form.controls['clientName'].valid;
      this.isValidClientLastName = this.form.controls['clientLastName'].valid;
      this.isValidClientDni = this.form.controls['clientDni'].valid;
      this.isValidClientPhoneNumber = this.form.controls['clientPhoneNumber'].valid;
      this.isValidClientEmail = this.form.controls['clientEmail'].valid;

      return;
    }
    this.resetValidators();

    const command: CreateTurnAdminCommand = this.getCreateCommand();

    this.startLoading();
    this.turnService.CreateTurnAdmin(command).subscribe(
      res => {
        this.stopLoading();
        this.bService.toastr.success('Turno creado', 'Éxito!');
        this.bService.router.navigate([this.url]);
      },
      err => {
        const error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
        this.stopLoading();
      }
    );
  }

  getCreateCommand() : CreateTurnAdminCommand {
    const date = new Date(this.form.value.date);

    return new CreateTurnAdminCommand(date,
                                      this.form.value.time,
                                      this.form.value.idField,
                                      this.form.value.clientName,
                                      this.form.value.clientLastName,
                                      this.form.value.clientDni,
                                      this.form.value.clientPhoneNumber,
                                      this.form.value.clientEmail);
  }

  resetValidators() {
    this.isValid = true;
    this.isValidDate = true;
    this.isValidTime = true;
    this.isValidField = true;
    this.isValidClientName = true;
    this.isValidClientLastName = true;
    this.isValidClientDni = true;
    this.isValidClientPhoneNumber = true;
    this.isValidClientEmail = true;
  }

  private startLoading(){
    this.bService.spinner.show();
    this.loading = true;
  }

  private stopLoading(){
    this.bService.spinner.hide();
    this.loading = false;
  }
}
