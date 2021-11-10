import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr/public_api';
import { RegistrationRequest } from 'src/app/models/auth/registration-request';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public spinner: NgxSpinnerService;
  public toastr: ToastrService;
  public router: Router;

  public registerForm: FormGroup = this.baseComonentService.formBuilder.group(
    {
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    }
  );

  constructor(private readonly baseComonentService: BaseComponentService,
              private readonly authService: AuthService) 
  {
    this.spinner = baseComonentService.spinner;
    this.toastr = baseComonentService.toastr;
    this.router = baseComonentService.router;
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
    const username: string = this.registerForm.value.username;
    const email: string = this.registerForm.value.email;
    const password: string = this.registerForm.value.password;

    this.spinner.show();
    this.authService.register(new RegistrationRequest(name, lastName, email, username, password, 'AppUser')).subscribe(
      res => {
        this.toastr.success('Registrado con exito!', 'Exito!');
        this.router.navigate(['auth/login']);
      },
      err => {
        this.authService.terminateSession();
        const error = this.baseComonentService.handleErrorMessage(err);
        this.toastr.error(error.message, error.title);
      }
    ).add(() => this.spinner.hide());

  }

}
