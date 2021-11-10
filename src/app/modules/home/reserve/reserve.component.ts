import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { CheckBoxControl } from 'src/app/shared/dynamic/models/check-box-control';
import { DropDownControl } from 'src/app/shared/dynamic/models/drop-down-control';
import { FormControlBase } from 'src/app/shared/dynamic/models/form-control-base';
import { TextBoxControl } from 'src/app/shared/dynamic/models/text-box-control';
import { isFormValue } from 'src/app/shared/utils/functions.utils';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {

  // form
  public controls: FormControlBase<string>[] = [];
  public submitButtonText: string = "Buscar";

  public validTimes: ComboBox[] = [ 
    new ComboBox('9','09:00'), 
    new ComboBox('10','10:00'), 
    new ComboBox('11','11:00'), 
    new ComboBox('12','12:00'), 
    new ComboBox('13','13:00'), 
    new ComboBox('14','14:00'), 
    new ComboBox('15','15:00'), 
    new ComboBox('16','16:00'), 
    new ComboBox('17','17:00'), 
    new ComboBox('18','18:00'), 
    new ComboBox('19','19:00'), 
    new ComboBox('20','20:00'), 
    new ComboBox('21','21:00'), 
    new ComboBox('22','22:00'), 
    new ComboBox('23','23:00'), 
  ];

  public fieldTypes: ComboBox[] = [ //TODO: deben venir del backend todos los tipos no eliminados
    new ComboBox('1', 'Futbol 5'),
    new ComboBox('2', 'Futbol 8'),
    new ComboBox('3', 'Futbol 11'),
  ]

  constructor(private readonly baseComponentService: BaseComponentService) { }

  ngOnInit(): void {

    this.initFormControls();

  }


  formSubmit(value: any): void {

    if(!isFormValue(value)) {
      return;
    }

    const formValue = JSON.parse(value);

    console.log(formValue);

    // aca debe redirigir a la pagina de busqueda de turnos
    // en esa pagina se mostraran las canchas disponibles y su costo....
    
  }

  private initFormControls() {
    const fieldTypeControl = new CheckBoxControl({
      key: 'fieldType',
      validators: [Validators.required],
      options: this.fieldTypes,
      order: 1
    });

    const validTimesControl = new DropDownControl({
      key: 'time',
      label: 'Hora: ',
      options: this.validTimes,
      defaultOption: 'Seleccione un valor',
      validators: [Validators.required],
      order: 3
    });

    const dateControl = new TextBoxControl({
      key: 'date',
      label: 'Fecha: ',
      type: 'date',
      validators: [Validators.required],
      order: 2
    });

    this.controls.push(fieldTypeControl, validTimesControl, dateControl);
  }

}
