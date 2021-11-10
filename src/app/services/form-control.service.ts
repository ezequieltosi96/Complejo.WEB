import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlBase } from '../shared/dynamic/models/form-control-base';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor() { }

  toFormGroup(controls: FormControlBase<string>[]) {
    const group: any = {};

    controls.forEach(control => {
      group[control.key] = control.validators ? new FormControl(control.value || '', control.validators)
                                            : new FormControl(control.value || '');
    });

    return new FormGroup(group);
  }
}
