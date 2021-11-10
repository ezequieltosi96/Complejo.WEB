import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlBase } from '../models/form-control-base';

@Component({
  selector: 'app-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.css']
})
export class DynamicFormControlComponent {

  @Input() public control!: FormControlBase<string>;
  @Input() public form!: FormGroup;
  @Input() public submitted: boolean = false;

  public errors: any;

  get isValid(): boolean {
    return this.form.controls[this.control.key].valid;
  }


}
