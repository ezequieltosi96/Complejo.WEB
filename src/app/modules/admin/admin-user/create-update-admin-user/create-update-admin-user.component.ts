import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateAdminUserCommand } from 'src/app/gateway/commands/user/create-admin-user.command';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { UserService } from 'src/app/services/user.service';
import { FormControlBase } from 'src/app/shared/dynamic/models/form-control-base';
import { TextBoxControl } from 'src/app/shared/dynamic/models/text-box-control';
import { Regex } from 'src/app/shared/utils/enums.utils';
import { isFormValue } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-create-update-admin-user',
  templateUrl: './create-update-admin-user.component.html',
  styleUrls: ['./create-update-admin-user.component.css']
})
export class CreateUpdateAdminUserComponent implements OnInit {

  public id!: string;

  public loading: boolean = true;
  public title: string = 'Nuevo usuario admin';
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

    this.initForm();

    this.bService.spinner.hide();
  }

  initForm(): void {
    this.controls = [
      new TextBoxControl({
        key: 'email',
        value: '',
        type: 'email',
        label: 'Correo: ',
        validators: [Validators.required, Validators.email],
        errorMessage: 'Ingresa un correo valido.',
        order: 1
      }),
      new TextBoxControl({
        key: 'firstName',
        value: '',
        type: 'text',
        label: 'Nombre: ',
        validators: [Validators.required, Validators.pattern(Regex.LETTERS_SPACE), Validators.minLength(3)],
        errorMessage: 'Ingresa un nombre valido (mínimo 3 caracteres).',
        order: 2
      }),
      new TextBoxControl({
        key: 'lastName',
        value: '',
        type: 'text',
        label: 'Apellido: ',
        validators: [Validators.required, Validators.pattern(Regex.LETTERS_SPACE), Validators.minLength(3)],
        errorMessage: 'Ingresa un apellido valido (mínimo 3 caracteres).',
        order: 3
      })
    ];

    this.loading = false;
  }

  formSubmit(value: any): void {
    if(!isFormValue(value)) {
      return;
    }

    const formValue = JSON.parse(value);

    this.createUser(formValue);
  }

  createUser(formValue: any) {
    this.bService.spinner.show();
    
    const command: CreateAdminUserCommand = new CreateAdminUserCommand(formValue.email, formValue.firstName, formValue.lastName);
    this.userService.CreateUser(command).subscribe(
      res => {
        this.bService.toastr.success('Usuario creado', 'Éxito!');
      },
      err => {
        let error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
      }
    ).add(() => this.bService.spinner.hide());
  }

}
