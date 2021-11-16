import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateFieldCommand } from 'src/app/gateway/commands/field/create-field.command';
import { UpdateFieldCommand } from 'src/app/gateway/commands/field/update-field.command';
import { GetAllFieldStatusQuery } from 'src/app/gateway/querys/field/all-field-status.query';
import { GetAllFieldTypeQuery } from 'src/app/gateway/querys/field/all-field-type.query';
import { FieldById } from 'src/app/models/field/field-by-id';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { FieldService } from 'src/app/services/field.service';
import { DropDownControl } from 'src/app/shared/dynamic/models/drop-down-control';
import { FormControlBase } from 'src/app/shared/dynamic/models/form-control-base';
import { TextBoxControl } from 'src/app/shared/dynamic/models/text-box-control';
import { Regex } from 'src/app/shared/utils/enums.utils';
import { isFormValue, isNullOrUndefined } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-create-update-field',
  templateUrl: './create-update-field.component.html',
  styleUrls: ['./create-update-field.component.css']
})
export class CreateUpdateFieldComponent implements OnInit {

  public id!: string;

  public field: FieldById = new FieldById('' ,'', 0, '', '', 0, '', '', 0);
  public fieldStatus: ComboBox[] = [];
  public fieldTypes: ComboBox[] = [];

  public loading: boolean = true;
  public title: string = 'Nueva cancha';
  public isEdit: boolean = false;

  //#region Form
  public controls : FormControlBase<string>[] = [];
  public formErrorMessage: string = 'Formulario invalido.';
  public submitButtonText: string = 'Guardar';
  public hasBackButton: boolean = true;
  public backButtonText: string = 'Volver';
  public url: string = '/admin/fields';
  //#endregion

  constructor(private readonly bService: BaseComponentService,
              private readonly route: ActivatedRoute,
              private readonly fieldService: FieldService) {
                this. id = this.route.snapshot.paramMap.get('id')!;
              }

  ngOnInit(): void {
    this.startLoading();

    let promises: Promise<void>[] = [];

    if(!isNullOrUndefined(this.id)){
      this.title = 'Editar cancha';
      this.isEdit = true;
      promises.push(this.getFieldByIdPromise(this.id));
    }

    promises.push(this.getAllFieldStatusByFieldPromise());
    promises.push(this.getAllFieldTypeByFieldPromise());

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .then(() => this.initForm())
      .finally(() => this.stopLoading());
  }

  getAllFieldStatusByFieldPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldStatus(new GetAllFieldStatusQuery(this.id ? this.id : null)).subscribe(
        res => {
          this.fieldStatus = res;
          resolve();
        },
        err => {
          this.fieldStatus = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  getAllFieldTypeByFieldPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldType(new GetAllFieldTypeQuery(this.id ? this.id : null)).subscribe(
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

  getFieldByIdPromise(id: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetFieldById(this.id).subscribe(
        res => {
          this.field = res;
          console.log(this.field)
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

  initForm(): void {
    this.controls = [
      new TextBoxControl({
        key: 'description',
        value: this.field.description,
        type: 'text',
        label: 'Descripción: ',
        validators: [Validators.required],
        errorMessage: 'Ingresa una descripción valida.',
        order: 1
      }),
      new DropDownControl({
        key: 'idFieldStatus',
        defaultOption: 'Seleccione un estado',
        options: this.fieldStatus,
        value: this.field.idStatus !== '' ? this.field.idStatus : undefined,
        validators: [Validators.required],
        errorMessage: 'Seleccione una opción.',
        label: 'Estado: ',
        order: 3
      }),
      new DropDownControl({
        key: 'idFieldType',
        defaultOption: 'Seleccione un tipo',
        options: this.fieldTypes,
        value: this.field.idType !== '' ? this.field.idType : undefined,
        validators: [Validators.required],
        errorMessage: 'Seleccione una opción.',
        label: 'Tipo: ',
        order: 2
      }),
      new TextBoxControl({
        key: 'price',
        value: `${this.field.price}`,
        type: 'text',
        label: 'Precio: ',
        validators: [Validators.required, Validators.pattern(Regex.NUMBERS)],
        errorMessage: 'Ingresa un precio valido (debe ser mayor a cero).',
        order: 4
      }),
    ];
  }

  formSubmit(value: any): void{
    if(!isFormValue(value)){
      return;
    }

    const formValue = JSON.parse(value);

    this.createUpdateField(formValue);
  }

  createUpdateField(formValue: any): void {
    this.bService.spinner.show();

    if(this.isEdit) {
      let updateCommand: UpdateFieldCommand = this.getUpdateCommand(formValue);
      this.fieldService.UpdateField(updateCommand).subscribe(
        res => {
          this.id = res;
          this.bService.toastr.success('Cancha actualizada con éxito.', 'Éxito!');
        },
        err => {
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
        }
      ).add(() => this.bService.spinner.hide());
      return;
    }

    let createCommand: CreateFieldCommand = this.getCreateCommand(formValue);
    this.fieldService.CreateField(createCommand).subscribe(
      res => {
        this.id = res;
        this.isEdit = true;
        this.title = 'Editar cancha';
        this.getFieldByIdPromise(this.id);
        this.bService.toastr.success('Cancha creada con éxito.', 'Éxito!');
      },
      err => {
        const error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
      }
    ).add(() => this.bService.spinner.hide());
  }

  getUpdateCommand(formValue: any) : UpdateFieldCommand {
    let command: UpdateFieldCommand = new UpdateFieldCommand(this.id, 
                                                             formValue.description, 
                                                             formValue.idFieldType,
                                                             formValue.idFieldStatus,
                                                             Number(formValue.price));

    return command;
  }

  getCreateCommand(formValue: any) : CreateFieldCommand {
    let command: CreateFieldCommand = new CreateFieldCommand(formValue.description, 
                                                             formValue.idFieldType,
                                                             formValue.idFieldStatus,
                                                             Number(formValue.price));

    return command;
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
