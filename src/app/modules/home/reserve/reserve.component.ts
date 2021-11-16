import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GetAllFieldTypeQuery } from 'src/app/gateway/querys/field/all-field-type.query';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { DataService } from 'src/app/services/data.service';
import { FieldService } from 'src/app/services/field.service';
import { TurnService } from 'src/app/services/turn.service';
import { isFormValue, isNullOrUndefined } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {

  public fieldTypes: ComboBox[] = [];
  public times: ComboBox[] = [];

  public today: string = new Date().toISOString().split('T')[0];

  public form: FormGroup = this.bService.formBuilder.group({
    idFieldType: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly fieldService: FieldService,
              private readonly turnService: TurnService,
              private dataService: DataService) { }

  ngOnInit(): void {

    this.startLoading();

    let promises: Promise<void>[] = [];

    promises.push(this.getAllFieldTypeByFieldPromise());
    promises.push(this.getAllValidTimesPromise());

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .finally(() => this.stopLoading());
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

  getAllFieldTypeByFieldPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldType(new GetAllFieldTypeQuery(null)).subscribe(
        res => {
          this.fieldTypes = res;
          resolve();
        },
        err => {
          this.fieldTypes = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  onChangeDate(date: string) {
    if(isNullOrUndefined(date)){
      return;
    }

    this.startLoading();
    if(date !== this.today){
      this.resolvePromises([this.getAllValidTimesPromise()]);
      return;
    }

    const time = new Date().toLocaleTimeString().split(':')[0];
    let newTimes: ComboBox[] = [];
    this.times.forEach(value => {
      if(Number(value.id) > Number(time)){
        newTimes.push(value);
      }
    });
    this.times = newTimes;

    this.stopLoading();
  }

  formSubmit(): void {
    if(this.form.invalid) {
      return;
    }
    
    this.dataService.reserveParams = this.form.value;
    
    this.bService.router.navigate(['home/reserve/result']);
  }

  private startLoading(){
    this.bService.spinner.show();
  }

  private stopLoading(){
    this.bService.spinner.hide();
  }

}
