import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseComponentService } from 'src/app/services/base/base-component.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css']
})
export class ConsultComponent implements OnInit {

  public consultForm: FormGroup = this.bService.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(7)]]
  });

  constructor(private readonly bService: BaseComponentService) { }

  ngOnInit(): void {
  }

  consultFormOnSubmit() {

    if(this.consultForm.invalid){
      return;
    }

    this.bService.router.navigate([`home/consult/${this.consultForm.value.code}`]);
  }

}
