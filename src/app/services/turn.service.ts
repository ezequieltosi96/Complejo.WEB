import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CancelTurnCommand } from '../gateway/commands/turn/cancel-turn.command';
import { CreateReservationLoggedInClientCommand } from '../gateway/commands/turn/create-reservation-logged-in-client.command';
import { CreateReservationUnregisteredClientCommand } from '../gateway/commands/turn/create-reservation-unregistered-client.command';
import { CreateTurnAdminCommand } from '../gateway/commands/turn/create-turn-admin.command';
import { GetAllTurnsByClientQuery } from '../gateway/querys/turn/all-turns-by-client.query';
import { GetAllAvailableFieldByDateTimeQuery } from '../gateway/querys/turn/available-field-by-date-time.query';
import { GetTurnByFilterQuery } from '../gateway/querys/turn/turn-by-filter.query';
import { ComboBox } from '../models/responses/combo-box';
import { PagedListResponse } from '../models/responses/paged-list-response';
import { TurnByClient } from '../models/turn/turn-by-client';
import { TurnByFilter } from '../models/turn/turn-by-filter';
import { TurnById } from '../models/turn/turn-by-id';
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

  CreateReservationLoggedInClient(command: CreateReservationLoggedInClientCommand) : Observable<string> {
    const url = `${this.prefix}/registered`;
    return this.apiService.post<string>(url, command);
  }

  CreateReservationUnregisteredClient(command: CreateReservationUnregisteredClientCommand) : Observable<string> {
    const url = `${this.prefix}/unregistered`;
    return this.apiService.post<string>(url, command);
  }

  DeleteTurn(id: string) : Observable<object> {
    return this.apiService.delete(this.prefix, id);
  }

  CancelTurn(command: CancelTurnCommand) : Observable<object> {
    const url = `${this.prefix}/cancel`;
    return this.apiService.delete(url, command.id);
  }

  GetTurnByCode(code: string) : Observable<TurnById> {
    const url = `${this.prefix}/by-code?Code=${code}`;
    return this.apiService.get<TurnById>(url);
  }

  GetTurnByFilter(query: GetTurnByFilterQuery): Observable<PagedListResponse<TurnByFilter[]>> {
    const url = `${this.prefix}/by-filter${query.getParams()}`;
    return this.apiService.get<PagedListResponse<TurnByFilter[]>>(url);
  }
  
  GetAllTurnsByClient(query: GetAllTurnsByClientQuery): Observable<PagedListResponse<TurnByClient[]>> {
    const url = `${this.prefix}/by-client${query.getParams()}`;
    return this.apiService.get<PagedListResponse<TurnByClient[]>>(url);
  }

  GetAllAvailableFieldByDateTime(query: GetAllAvailableFieldByDateTimeQuery): Observable<ComboBox[]> {
    const url = `${this.prefix}/available-field-by-date-time${query.getParams()}`;
    return this.apiService.get<ComboBox[]>(url);
  }
}
