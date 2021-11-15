import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateTurnAdminCommand } from '../gateway/commands/turn/create-turn-admin.command';
import { GetAllAvailableFieldByDateTimeQuery } from '../gateway/querys/turn/available-field-by-date-time.query';
import { GetTurnByFilterQuery } from '../gateway/querys/turn/turn-by-filter.query';
import { ComboBox } from '../models/responses/combo-box';
import { PagedListResponse } from '../models/responses/paged-list-response';
import { TurnByFilter } from '../models/turn/turn-by-filter';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TurnService {

  private validTimes: Observable<ComboBox[]> = of([ new ComboBox('9','09:00'), 
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
                                                    new ComboBox('23','23:00') ]);

  private readonly prefix: string = 'turn';

  constructor(private readonly apiService: ApiService) { }

  GetValidTimesForReservation(): Observable<ComboBox[]> {
    return this.validTimes;
  }

  CreateTurnAdmin(command: CreateTurnAdminCommand): Observable<string> {
    return this.apiService.post<string>(this.prefix, command);
  }

  DeleteTurn(id: string) : Observable<object> {
    return this.apiService.delete(this.prefix, id);
  }


  GetTurnByFilter(query: GetTurnByFilterQuery): Observable<PagedListResponse<TurnByFilter[]>> {
    const url = `${this.prefix}/by-filter${query.getParams()}`;
    return this.apiService.get<PagedListResponse<TurnByFilter[]>>(url);
  }

  GetAllAvailableFieldByDateTime(query: GetAllAvailableFieldByDateTimeQuery): Observable<ComboBox[]> {
    const url = `${this.prefix}/available-field-by-date-time${query.getParams()}`;
    return this.apiService.get<ComboBox[]>(url);
  }
}
