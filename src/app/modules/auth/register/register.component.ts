import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr/public_api';
import { AuthenticationRequest } from 'src/app/models/auth/authentication-request';
import { RegistrationRequest } from 'src/app/models/auth/registration-request';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { Regex } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public spinner: NgxSpinnerService;
  public toastr: ToastrService;
  public router: Router;

  public registerForm: FormGroup = this.bService.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
      lastName: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(Regex.NUMBERS)]],
      dni: ['', [Validators.required, Validators.pattern(Regex.NUMBERS), Validators.maxLength(8), Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    }
  );

  constructor(private readonly bService: BaseComponentService,
              private readonly authService: AuthService) 
  {
    this.spinner = bService.spinner;
    this.toastr = bService.toastr;
    this.router = bService.router;
  }

  ngOnInit(): void {
  }


  registerFormOnSubmit(): void {
    if(this.registerForm.invalid) {
      this.toastr.error('Formulario invalido', 'Error');
      return;
    }

    const name: string = this.registerForm.value.name;
    const lastName: string = this.registerForm.value.lastName;
    const email: string = this.registerForm.value.email;
    const password: string = this.registerForm.value.password;
    const dni: string = this.registerForm.value.dni;
    const phoneNumber: string = this.registerForm.value.phoneNumber;

    this.spinner.show();
    this.authService.register(new RegistrationRequest(name, lastName, email,  password, 'AppUser', dni, phoneNumber)).subscribe(
      res => {
        this.toastr.success('Registrado con exito!', 'Exito!');
        this.authService.login(new AuthenticationRequest(email, password)).subscribe(
          resp => {
            this.authService.setSession(resp.token);
            this.router.navigate(['home/index']);
          },
          err => {
            let error = this.bService.handleErrorMessage(err);
            this.bService.toastr.error(error.message, error.title);
          }
        );
      },
      err => {
        this.authService.terminateSession();
        const error = this.bService.handleErrorMessage(err);
        this.toastr.error(error.message, error.title);
      }
    ).add(() => this.spinner.hide());

  }

}
