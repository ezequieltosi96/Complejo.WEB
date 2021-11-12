import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateUserCommand } from 'src/app/gateway/commands/user/create-user.command';
import { UpdateUserCommand } from 'src/app/gateway/commands/user/update-user.command';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { User } from 'src/app/models/user/user';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { UserService } from 'src/app/services/user.service';
import { DropDownControl } from 'src/app/shared/dynamic/models/drop-down-control';
import { FormControlBase } from 'src/app/shared/dynamic/models/form-control-base';
import { TextBoxControl } from 'src/app/shared/dynamic/models/text-box-control';
import { Regex } from 'src/app/shared/utils/enums.utils';
import { isFormValue, isNullOrUndefined } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-create-update-admin-user',
  templateUrl: './create-update-admin-user.component.html',
  styleUrls: ['./create-update-admin-user.component.css']
})
export class CreateUpdateAdminUserComponent implements OnInit {

  public id!: string;
  public user: User = new User('', '', '', '', '');

  public loading: boolean = true;
  public title: string = 'Nuevo usuario';
  public isEdit: boolean = false;

  //#region Form
  public controls : FormControlBase<string>[] = [];
  public formErrorMessage: string = 'Formulario invalido.';
  public submitButtonText: string = 'Guardar';
  public hasBackButton: boolean = true;
  public backButtonText: string = 'Volver';
  public url: string = '/admin/users';
  //#endregion

  constructor(private readonly bService: BaseComponentService,
              private readonly route: ActivatedRoute,
              private readonly userService: UserService) { 
              
                this. id = this.route.snapshot.paramMap.get('id')!;

              }

  ngOnInit(): void {
    this.bService.spinner.show();

    let promises: Promise<void>[] = [];

    if(!isNullOrUndefined(this.id)) {
      this.title = 'Editar usuario';
      this.isEdit = true;
      promises.push(this.getUserByIdPromise());
    }

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]): void {
    Promise.all(promises)
    .then(() => this.initForm())
    .finally(() => this.bService.spinner.hide());
  }

  initForm(): void {
    this.controls = [
      new TextBoxControl({
        key: 'email',
        value: this.user.email,
        type: 'email',
        label: 'Correo: ',
        validators: [Validators.required, Validators.email],
        errorMessage: 'Ingresa un correo valido.',
        order: 1
      }),
      new TextBoxControl({
        key: 'firstName',
        value: this.user.firstName,
        type: 'text',
        label: 'Nombre: ',
        validators: [Validators.required, Validators.pattern(Regex.LETTERS_SPACE), Validators.minLength(3)],
        errorMessage: 'Ingresa un nombre valido (mínimo 3 caracteres).',
        order: 2
      }),
      new TextBoxControl({
        key: 'lastName',
        value: this.user.lastName,
        type: 'text',
        label: 'Apellido: ',
        validators: [Validators.required, Validators.pattern(Regex.LETTERS_SPACE), Validators.minLength(3)],
        errorMessage: 'Ingresa un apellido valido (mínimo 3 caracteres).',
        order: 3
      }),
      new DropDownControl({
        key: 'roleName',
        defaultOption: 'Seleccione un rol',
        options: [
          new ComboBox('Admin', 'Admin'),
          new ComboBox('AppUser', 'AppUser'),
        ],
        validators: [Validators.required],
        errorMessage: this.user.roleName !== '' ? undefined : 'Seleccione un rol.',
        value: this.user.roleName !== '' ? this.user.roleName : undefined,
        label: 'Rol',
        order: 4
      })
    ];

    this.loading = false;
  }

  getUserByIdPromise(): Promise<void> {
    return new Promise((resolve, reject) =>{
      this.userService.GetUserById(this.id).subscribe(
        res => {
          this.user = res;
          resolve();
        },
        err => {
          this.bService.toastr.error(err.error, 'Error');
          reject();
        }
      );
    });
  }

  formSubmit(value: any): void {
    if(!isFormValue(value)) {
      return;
    }

    const formValue = JSON.parse(value);

    this.createUpdateUser(formValue);
  }

  createUpdateUser(formValue: any) {
    this.bService.spinner.show();
    if(this.isEdit) {
      const command: UpdateUserCommand = new UpdateUserCommand(formValue.email, formValue.firstName, formValue.lastName, formValue.roleName, this.id);
      this.userService.UpdateUser(command).subscribe(
        res => {
          this.bService.toastr.success('Usuario actualizado', 'Éxito!');
        },
        err => {
          this.bService.toastr.error(err.error, 'Error');
        }
      ).add(() => this.bService.spinner.hide());
    }
    else {
      const command: CreateUserCommand = new CreateUserCommand(formValue.email, formValue.firstName, formValue.lastName, formValue.roleName);
      this.userService.CreateUser(command).subscribe(
        res => {
          this.bService.toastr.success('Usuario creado', 'Éxito!');
        },
        err => {
          this.bService.toastr.error(err.error, 'Error');
        }
      ).add(() => this.bService.spinner.hide());
    }
  }

}
