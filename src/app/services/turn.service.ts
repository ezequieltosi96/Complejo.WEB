import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ComboBox } from '../models/responses/combo-box';

@Injectable({
  providedIn: 'root'
})
export class TurnService {

  private validTimes: Observable<ComboBox[]> = of([ 
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
                                                  ]);

  
  constructor() {}

  GetValidTimesForReservation(): Observable<ComboBox[]> {
    return this.validTimes;
  }
}
