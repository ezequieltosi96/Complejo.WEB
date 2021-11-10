import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BaseComponentService {

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public spinner: NgxSpinnerService,
              public matDialog: MatDialog,
              public toastr: ToastrService) { }

  // TODO: manejo de errores global
  public handleErrorMessage(err: any): any {

    let error = {
      title: 'Error',
      message: 'Unknow error.'
    };

    if(err.error?.error) {
      error.message = err.error.error;
      return error;
    }

    if(err.error?.errors){
      error.title = err.error.title;
      error.message = '';
      return error;
    }

    return error;
  }
}
