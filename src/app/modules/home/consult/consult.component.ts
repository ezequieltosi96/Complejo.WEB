import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css']
})
export class ConsultComponent implements OnInit {

  public consultForm: FormGroup = this.baseComponentService.formBuilder.group({
    code: ['', Validators.required]
  });

  constructor(private readonly baseComponentService: BaseComponentService) { }

  ngOnInit(): void {
  }

  consultFormOnSubmit() {
    console.log(this.consultForm.value);
  }

}
