import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationRequest } from 'src/app/models/auth/authentication-request';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public spinner: NgxSpinnerService;
  public toastr: ToastrService;
  public router: Router;

  public loginForm: FormGroup = this.baseComonentService.formBuilder.group(
    {
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

  loginFormOnSubmit(): void {
    if(this.loginForm.invalid) {
      this.toastr.error('Formulario invalido', 'Error');
      return;
    }

    const email: string = this.loginForm.value.email;
    const password: string = this.loginForm.value.password;

    this.spinner.show();
    this.authService.login(new AuthenticationRequest(email, password)).subscribe(
      res => {
        this.authService.setSession(res.token);
        const userContext = this.authService.getUserContext()!;
        this.toastr.success('', `Bienvenido ${userContext.userName}`);

        userContext.isAdmin ? this.router.navigate(['admin/turns']) : this.router.navigate(['home/index']);
      },
      err => {
        this.authService.terminateSession();
        const error = this.baseComonentService.handleErrorMessage(err);
        this.toastr.error(error.message, error.title);
      }
    ).add(() => this.spinner.hide());

  }

}
