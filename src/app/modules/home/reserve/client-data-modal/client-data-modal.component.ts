import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { Regex } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-client-data-modal',
  templateUrl: './client-data-modal.component.html',
  styleUrls: ['./client-data-modal.component.css']
})
export class ClientDataModalComponent{

  public client: any;

  public submitted: boolean = false;
  public isValid: boolean = true;
  public isValidName: boolean = true;
  public isValidLastName: boolean = true;
  public isValidDni: boolean = true;
  public isValidPhoneNumber: boolean = true;
  public isValidEmail: boolean = true;

  public form: FormGroup = this.bService.formBuilder.group({
    Name: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
    LastName: ['', [Validators.required, Validators.pattern(Regex.LETTERS_SPACE)]],
    Dni: ['', [Validators.required, Validators.pattern(Regex.NUMBERS), Validators.minLength(8), Validators.maxLength(8)]],
    PhoneNumber: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(Regex.NUMBERS)]],
    Email: ['', [Validators.required, Validators.email]]
  });

  constructor(private readonly bService: BaseComponentService,
              public dialogRef: MatDialogRef<ClientDataModalComponent>) { }

  formSubmit(){
    this.submitted = true;
    
    if(this.form.invalid){
      this.isValidName = this.form.controls['Name'].valid;
      this.isValidLastName = this.form.controls['LastName'].valid;
      this.isValidDni = this.form.controls['Dni'].valid;
      this.isValidPhoneNumber = this.form.controls['PhoneNumber'].valid;
      this.isValidEmail = this.form.controls['Email'].valid;

      return;
    }

    this.dialogRef.close({ data: this.form.value, confirm: true});
  }

  close() {
    this.dialogRef.close({confirm: false});
  }

}
