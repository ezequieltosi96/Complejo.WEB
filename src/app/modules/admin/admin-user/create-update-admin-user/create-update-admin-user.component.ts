import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { UserService } from 'src/app/services/user.service';
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
  public user: User = new User('', '', '', '');

  public loading: boolean = true;
  public title: string = 'Nuevo usuario';

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
      promises.push(); //hago llamada a la promesa para inicializar el valor de user
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
        key: 'name',
        value: this.user.name,
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
    ];

    this.loading = false;
  }

  formSubmit(value: any): void {
    if(!isFormValue(value)) {
      return;
    }

    const formValue = JSON.parse(value);

    console.log(formValue);
  }

}
