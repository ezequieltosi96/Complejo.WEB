import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { FormControlService } from 'src/app/services/form-control.service';
import { FormControlBase } from '../models/form-control-base';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  @Input() public controls: FormControlBase<string>[] | null = [];

  @Input() public formErrorMessage!: string;
  @Input() public submitButtonText!: string;
  @Input() public hasBackButton: boolean = false;
  @Input() public backButtonText: string = '';

  @Input() public url!: string;
  @Input() public navParams!: NavigationExtras;

  @Output() public submit: EventEmitter<string> = new EventEmitter<string>();
  
  public payload: string = '';
  
  public form!: FormGroup;

  public submitted: boolean = false;

  constructor(private readonly formControlService: FormControlService,
              private readonly router: Router) { }

  ngOnInit(): void {
    if(this.controls !== null){
      this.controls = this.controls.sort((a, b) => a.order - b.order);
      this.form = this.formControlService.toFormGroup(this.controls);
    }
  }

  onSubmit() {
    this.payload = JSON.stringify(this.form.getRawValue());
    this.submitted = true;
    if(this.form.valid)
      this.submit.emit(this.payload);
  }

  goBack() {
    if(this.hasBackButton)
      this.router.navigate([this.url], this.navParams)
  }

  get isValid(): boolean {
    return this.form.valid;
  }

}
